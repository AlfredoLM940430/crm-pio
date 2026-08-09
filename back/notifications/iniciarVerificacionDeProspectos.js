const cron = require('node-cron');
const Prospecto = require('../models/Prospecto');
const Colaborador = require('../models/Colaborador');
const Notificacion = require('../models/Notificacion');

const kpisExcluidos = [
    "Crédito colocado", 
    "Nuevo socio", 
    "Desistió", 
    "Ahorro | Inversión"
];

const reglasNotificacion = [
    {
        filtro: { KPI: { $nin: kpisExcluidos } },
        evento: 'alerta-prospecto-inactivo',
        titulo: 'Prospecto sin seguimiento',
        mensaje: (nombreCompleto, prospecto, diasInactivo) =>
            `El prospecto ${nombreCompleto} lleva ${diasInactivo} días sin actualización (KPI: ${prospecto.KPI}).`,
    }
];

function iniciarVerificacionDeProspectos(io) {
    cron.schedule('* * * * *', async () => { 
        try {
            console.log('--- Verificando prospectos inactivos ---');

            const ahora = new Date();
            const minutosLimite = 1; 
            const fechaLimite = new Date();
            fechaLimite.setMinutes(fechaLimite.getMinutes() - minutosLimite);

            for (const regla of reglasNotificacion) {
                const filtro = {
                    lastDateControl: { $lte: fechaLimite },
                    ...regla.filtro,
                };

                const prospectosAfectados = await Prospecto.find(filtro).populate('assignedTo', 'branch userLevel');
            
                if (prospectosAfectados.length === 0) {
                    continue;
                }

                for (const prospecto of prospectosAfectados) {
                    const assignedId = prospecto?.assignedTo?._id 
                        ? prospecto.assignedTo._id.toString() 
                        : null;

                    const nombreCompleto = `${prospecto.firstName} ${prospecto.lastName}`;

                    const yaExisteEnBD = await Notificacion.findOne({
                        prospectoId: prospecto._id,
                        usuarioId: assignedId,
                        tipoEvento: regla.evento,
                        leida: false
                    });

                    let notificacionPayload;

                    if (yaExisteEnBD) {
                        notificacionPayload = yaExisteEnBD;
                    } else {
                        notificacionPayload = await Notificacion.create({
                            usuarioId: assignedId,
                            branch: prospecto.branch,
                            prospectoId: prospecto._id,
                            tipoEvento: regla.evento,
                            titulo: regla.titulo,
                            mensaje: regla.mensaje(nombreCompleto, prospecto, 0),
                            leida: false
                        });
                    }

                    const branch = prospecto?.branch;

                    if (branch) {
                        io.to(`branch:${branch.toString()}`).emit(regla.evento, notificacionPayload);
                    }

                    io.to('supervisores').emit(regla.evento, notificacionPayload);
                }
            }
        } catch (error) {
            console.error('Error en la verificación de prospectos:', error);
        }
    });
}

module.exports = iniciarVerificacionDeProspectos;