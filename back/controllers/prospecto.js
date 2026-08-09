
const express = require('express');
const multer  = require('multer');
const ExcelJS = require('exceljs');
const router  = express.Router();
const upload  = multer({ dest: 'uploads/' });
const Prospecto = require('../models/Prospecto');
const Colaborador = require('../models/Colaborador');
const { default: axios } = require('axios');
const Notificacion = require('../models/Notificacion');

const createProspecto = async (req, res) => {
    try {
        const { assignedTo, registerBy, registerByName, userLevel, ...datos } = req.body;

        const colaborador = await Colaborador.findById(registerBy);

        const fechaBase = new Date();
        const eventos = [{
            evento: 'Alta de prospecto',
            descripcion: 'Prospecto registrado en el sistema',
            fecha: fechaBase,
            registerBy,
            registerByName,
        }];

        if (assignedTo) {
            eventos.push({
                evento: 'Ejecutivo asignado',
                descripcion: 'Ejecutivo asignado al prospecto',
                fecha: new Date(fechaBase.getTime() + 1),
                registerBy,
                registerByName,
            });
        }

        const prospecto = new Prospecto({
            ...datos,
            assignedTo,
            registerBy,
            lastDateControl: new Date(),
            KPI: eventos[eventos.length - 1].evento,
            eventos
        });

        await prospecto.save();

        const levelID = colaborador.userLevel

        //! NO GUARDAR
        // notificacionDoc = await Notificacion.create({
        //     usuarioId: assignedTo,
        //     prospectoId: prospecto._id,
        //     branch: prospecto.branch,
        //     tipoEvento: 'prospecto:creado',
        //     titulo: 'Alta de prospecto',
        //     mensaje: `Nuevo prospecto en ${prospecto.branch}: ${prospecto.firstName} ${prospecto.lastName}`,
        //     leida: false
        // });
        // const notificacionPayload = notificacionDoc.toObject();

        const branch = prospecto.branch;

        const notificacionPayload = {
            usuarioId: assignedTo,
            prospectoId: prospecto._id,
            branch,
            tipoEvento: 'prospecto:creado',
            titulo: 'Alta de prospecto',
            mensaje: `Nuevo prospecto en ${branch}: ${prospecto.firstName} ${prospecto.lastName}`,
            leida: false,
            createdAt: new Date()
        };
 
        const io = req.app.get('socketio'); 
        if (io) {
            if (branch) {
                io.to(`branch:${branch}`).emit('prospecto:creado', {...notificacionPayload, levelID});
            }
            io.to('supervisores').emit('prospecto:creado', {...notificacionPayload, levelID});
        }

        res.status(201).json(prospecto);
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
};

const TIPOS_EXCLUIDOS_DE_RESTRICCION = ['Alta de prospecto', 'Ejecutivo asignado'];
const TODOS_LOS_TIPOS = [
    'Alta de prospecto', 'Ejecutivo asignado', 'Entrevista en sucursal',
    'Llamada 1', 'Llamada 2', 'Llamada 3', 'WhatsApp', 'Cita programada', 'Conclusión',
];

const getTiposDisponibles = async (req, res) => {
    const prospecto = await Prospecto.findById(req.params.id).select('eventos.evento');
    if (!prospecto) return res.status(404).json({ msg: 'No encontrado' });

    const tiposUsados = prospecto.eventos
        .map(e => e.evento)
        .filter(tipo => !TIPOS_EXCLUIDOS_DE_RESTRICCION.includes(tipo));

    const disponibles = TODOS_LOS_TIPOS.filter(tipo =>
        TIPOS_EXCLUIDOS_DE_RESTRICCION.includes(tipo)
            ? false
            : !tiposUsados.includes(tipo)
    );

    return res.status(200).json({
        ok: true,
        data: disponibles
    });
};

const addEvento = async (req, res) => {
    try {
        const { id } = req.params;
        const { evento, subOpcionConclusion, subOpcionNuevoSocio, assignedTo, ...restoBody } = req.body;

        const prospecto = await Prospecto.findById(id);
        if (!prospecto) {
            return res.status(404).json({ msg: 'Prospecto no encontrado' });
        }

        if (evento === 'Conclusión') {
            prospecto.KPI = subOpcionConclusion === 'Nuevo socio'
                ? subOpcionNuevoSocio
                : subOpcionConclusion;
            prospecto.eventos.push({ evento, subOpcionConclusion, subOpcionNuevoSocio, ...restoBody, fecha: new Date() });
            prospecto.lastDateControl = new Date();

        } else if (evento === 'Ejecutivo asignado') {
            if (!assignedTo) {
                return res.status(400).json({ msg: 'Se requiere el ID del ejecutivo.' });
            }
            prospecto.assignedTo = assignedTo;
            prospecto.KPI = 'Ejecutivo asignado';
            prospecto.eventos.push({
                evento,
                descripcion: 'Ejecutivo asignado al prospecto',
                fecha: new Date(),
                registerBy: assignedTo
            });
            prospecto.lastDateControl = new Date();

        } else {
            if (TIPOS_EXCLUIDOS_DE_RESTRICCION.includes(evento)) {
                return res.status(400).json({ msg: `El evento "${evento}" no se puede registrar manualmente` });
            }

            const yaExiste = prospecto.eventos.some(e => e.evento === evento);
            if (yaExiste) {
                return res.status(409).json({ msg: `El evento "${evento}" ya fue registrado para este prospecto` });
            }

            prospecto.KPI = evento;
            prospecto.eventos.push({ evento, subOpcionConclusion, subOpcionNuevoSocio, ...restoBody, fecha: new Date() });
            prospecto.lastDateControl = new Date();
        }

        await prospecto.save();

        const io = req.app.get('socketio'); 
        if (io) {
            io.emit('nuevo:evento');
        }

        return res.status(200).json({
            ok: true,
            msg: 'Evento registrado con éxito',
            prospecto
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Error interno del servidor', error: error.message });
    }
};

const xlsxProspectos = async(req, res = express.response) => {

    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(req.file.path);
        const sheet = workbook.worksheets[0];

        const headerRow = sheet.getRow(1);
        const headers = [];
        headerRow.eachCell((cell, colNumber) => {
            headers[colNumber] = cell.text.trim();
        });

        const data = [];

        sheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return;

            const rawRow = {};
            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                rawRow[headers[colNumber]] = cell.text?.trim() || "";
            });

            data.push({
                dateControl: rawRow['Fecha de registro'] ? new Date(rawRow['Fecha de registro']) : null,
                name: rawRow['Nombre completo'],
                contact: rawRow['Whatsap / correo'],
                branch: rawRow['Sucursal'],
                assigned: rawRow['Asesor responsable'],
                referral_source: rawRow['Como nos conoció'],
                interested_product: rawRow['Prod / serv de interés'],
                status: rawRow['Estatus prosp'],
                lastDateControl: rawRow['Fecha último contacto'] ? new Date(rawRow['Fecha último contacto']) : null,
                KPI: rawRow['KPI'],
                requested_amount: rawRow['Monto del crédito'],
            });
        });

        const ProspectosGuardados = await Prospecto.insertMany(data);

        const todosLosProspectos = await Prospecto.find().sort({ createdAt: -1 });

        return res.status(201).json({
            ok: true,
            msg: 'Excel importado y guardado en MongoDB con éxito',
            totalImportados: ProspectosGuardados.length,
            data: todosLosProspectos
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hubo un error al procesar o guardar el archivo excel',
            error: error.message
        });
    }
}

const getProspectos = async (req, res = express.response) => {
    try {
        const todosLosProspectos = await Prospecto.aggregate([
            {
                $addFields: {
                    eventos: {
                        $sortArray: { input: "$eventos", sortBy: { fecha: -1 } }
                    }
                }
            },
            {
                $addFields: {
                    ultimoEventoFecha: { $arrayElemAt: ["$eventos.fecha", 0] }
                }
            },
            {
                $sort: { ultimoEventoFecha: -1, createdAt: -1 }
            },
            {
                $lookup: {
                    from: 'colaboradors',
                    localField: 'assignedTo',
                    foreignField: '_id',
                    as: 'assignedTo'
                }
            },
            {
                $unwind: {
                    path: '$assignedTo',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    ultimoEventoFecha: 0
                }
            }
        ]);

        return res.status(201).json({
            ok: true,
            msg: 'Exito al consultar todos los Prospectos',
            totalConsultados: todosLosProspectos.length,
            data: todosLosProspectos
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error al consultar los Prospectos',
            error: error.message
        });
    }
};

const metricasProspectos = async (req, res) => {
    try {

        const totalProspectos = await Prospecto.countDocuments({
            KPI: { $nin: ["Crédito colocado", "Nuevo socio", "Desistió", "Ahorro | Inversión"] }
        });

        const totalSociosNuevos = await Prospecto.countDocuments({
            KPI: { $in: ["Crédito colocado", "Nuevo socio", "Ahorro | Inversión"] }
        });

        const totalCreditos = await Prospecto.countDocuments({
            KPI: "Crédito colocado"
        });

        const totalCitas = await Prospecto.countDocuments({
            KPI: "Cita programada"
        });

        const totalRegistros = await Prospecto.countDocuments();
        const porcentajeConversion = totalRegistros > 0
            ? Number(((totalSociosNuevos / totalRegistros) * 100).toFixed(2))
            : 0;

        const resultadoDias = await Prospecto.aggregate([
            {
                $match: {
                    dateControl: { $exists: true, $ne: null },
                    lastDateControl: { $exists: true, $ne: null }
                }
            },
            {
                $project: {
                    diferenciaDias: {
                        $divide: [
                            { $subtract: ["$lastDateControl", "$dateControl"] },
                            1000 * 60 * 60 * 24
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    promedioDias: { $avg: "$diferenciaDias" }
                }
            }
        ]);

        const promedioDias = resultadoDias.length > 0
            ? Number(resultadoDias[0].promedioDias.toFixed(2))
            : 0;   

        return res.status(200).json({
            ok: true,
            data: {
                totalProspectos,
                totalSociosNuevos,
                totalCreditos,
                totalCitas,
                porcentajeConversion: `${porcentajeConversion}%`,
                promedioDias
            }
        });

    } catch (error) {
        console.error("Error al obtener KPIs de prospectos:", error);
        return res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
            error: error.message
        });
    }
};

const filterProspectos = async (req, res) => {

    try {
        const { name, status, branch } = req.query;
        let query = {};

        if (name) {
            query.firstName = { $regex: name, $options: 'i' };
        }

        if (status && status !== 'Todos') {
            query.KPI = { $regex: status, $options: 'i' };
        }

        if (status && status === 'Conclusión') {
            query.KPI = { $regex: 'Desistió|Ahorro \\| Inversión|Crédito colocado', $options: 'i' };
        }

        if (branch && branch !== 'Todas') {
            query.branch = { $regex: branch, $options: 'i' };
        }

        const Prospectos = await Prospecto.find(query)
            .populate('assignedTo', 'firstName lastName')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            ok: true,
            msg: 'Éxito al consultar Prospectos',
            data: Prospectos
        });

    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
}

const obtenerMetricasGrafica = async (req, res) => {
    const MESES = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const resultado = await Prospecto.aggregate([
        { $match: { dateControl: { $gte: sixMonthsAgo } } },
        {
            $group: {
            _id: {
                year: { $year: "$dateControl" },
                month: { $month: "$dateControl" }
            },
            totalProspectos: { $sum: 1 },
            totalSocios: {
                $sum: {
                    $cond: [
                        { $in: ["$KPI", ["Crédito colocado", "Nuevo socio", "Ahorro | Inversión"]] },
                        1,
                        0
                    ]
                }
            }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        const maxProspectos = Math.max(...resultado.map(r => r.totalProspectos), 1);

        const data = resultado.map(r => {
        const { totalProspectos, totalSocios } = r;
        const conversion = totalProspectos > 0
            ? ((totalSocios / totalProspectos) * 100).toFixed(0)
            : "0";

        return {
            month: MESES[r._id.month - 1],
            sociosHeight: Math.round((totalSocios / maxProspectos) * 100),
            sociosValue: totalSocios,
            prospectosHeight: Math.round((totalProspectos / maxProspectos) * 100),
            prospectosValue: totalProspectos,
            conversion: `${conversion}%`
        };
        });

        return res.status(200).json({
            ok: true,
            msg: 'Éxito al consultar Prospectos',
            data: data,
        });

    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};

const getRelativeTime = (date) => {
    if (!date) return 'Sin actividad';

    const now = new Date();
    const past = new Date(date);
    const diffInMs = now - past;

    if (diffInMs < 0) return 'Hace unos segundos';

    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);

    if (diffInSeconds < 60) return 'Hace unos segundos';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
    if (diffInHours < 24) return `Hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
    if (diffInDays < 30) return `Hace ${diffInDays} ${diffInDays === 1 ? 'día' : 'días'}`;

    return `Hace ${diffInMonths} ${diffInMonths === 1 ? 'mes' : 'meses'}`;
};

const recentActivity = async (req, res) => {
    try {
        const Prospectos = await Prospecto.find()
            .sort({ lastDateControl: -1 })
            .limit(4);

        const ProspectosConTiempo = Prospectos.map(Prospecto => {
            const ProspectoObj = Prospecto.toObject();
            ProspectoObj.timeAgo = getRelativeTime(ProspectoObj.lastDateControl);
            return ProspectoObj;
        });

        return res.status(200).json({
            ok: true,
            msg: 'Éxito al consultar las últimas 4 actividades',
            data: ProspectosConTiempo
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            error: error.message
        });
    }
}

const incomingAppointments = async (req, res) => {
    try {
        const Prospectos = await Prospecto.find({ status: { $regex: /^Cita programada$/i } }).sort({ lastDateControl: -1 }).limit(2);

        return res.status(200).json({
            ok: true,
            msg: 'Éxito al consultar proximas entrevistas',
            data: Prospectos
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            error: error.message
        });
    }
}

const incomingAllAppointments = async (req, res) => {
    try {
        const Prospectos = await Prospecto.find({ status: { $regex: /^Cita programada$/i } }).sort({ lastDateControl: -1 });

        return res.status(200).json({
            ok: true,
            msg: 'Éxito al consultar proximas entrevistas',
            data: Prospectos
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            error: error.message
        });
    }
}

const createNotify = async (req, res) => {

    const { nombre } = req.body;

    const TELEGRAM_TOKEN = '8420237493:AAEnrbM_EjHUk1foolCb86qCvGt8kXo7Ywg';
    const CHAT_ID = 1339188480
    const mensaje = `Haz solicitado un 🔔 *Recordatorio*.`;

    try {
        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
        await axios.post(telegramUrl, {
            chat_id: CHAT_ID,
            text: mensaje,
            parse_mode: 'Markdown'
        });

        //! Whatsapp .28 centavos msj
        return res.status(200).json({ ok: true, message: 'Mensaje de Telegram enviado' });
    } catch (error) {
        console.error('Error enviando a Telegram:', error.response?.data || error.message);
        return res.status(500).json({ ok: false, error: 'No se pudo enviar el mensaje' });
    }
}

const getReferalSource = async (req, res) => {
    try {
        const resultado = await Prospecto.aggregate([
            {
                $group: {
                    _id: { $ifNull: [ "$referal_source", "No especificado" ] },
                    count: { $sum: 1 }
                }
            }
        ]);

        const conteoFormateado = resultado.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {});

        return res.status(200).json({
            ok: true,
            msg: 'Éxito al consultar proximas entrevistas',
            data: conteoFormateado
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            error: error.message
        });
    }
}

const getSemaforo = async (req, res) => {
    try {
        const resultado = await Prospecto.aggregate([
            {
                $match: {
                    KPI: { 
                        $nin: ["Crédito colocado", "Nuevo socio", "Ahorro | Inversión", "Desistió"] 
                    }
                }
            },
            {
                $project: {
                    diasTranscurridos: {
                        $dateDiff: {
                            startDate: "$lastDateControl",
                            endDate: "$$NOW",
                            unit: "day"
                        }
                    }
                }
            },
            {
                $project: {
                    semaforo: {
                        $switch: {
                            branches: [
                                { case: { $lt: ["$diasTranscurridos", 1] }, then: "verde" },
                                { case: { $lte: ["$diasTranscurridos", 5] }, then: "amarillo" }
                            ],
                            default: "rojo"
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$semaforo",
                    cantidad: { $sum: 1 }
                }
            }
        ]);

        return res.status(200).json({
            ok: true,
            msg: 'Éxito al consultar semaforo',
            data: resultado
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            error: error.message
        });
    }
}

module.exports = {
    createProspecto,
    getTiposDisponibles,
    addEvento,

    xlsxProspectos,
    createNotify,
    getProspectos,
    metricasProspectos,
    filterProspectos,
    obtenerMetricasGrafica,
    recentActivity,
    incomingAppointments,
    incomingAllAppointments,
    getReferalSource,
    getSemaforo,
}