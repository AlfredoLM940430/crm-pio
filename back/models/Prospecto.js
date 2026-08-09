const {Schema, model} = require('mongoose');

const EventoSchema = Schema({
    evento: {
        type: String,
        enum: ['Alta de prospecto', 'Ejecutivo asignado', 'Entrevista en sucursal', 'Llamada 1', 'Llamada 2', 'Llamada 3', 'WhatsApp', 'Cita programada', 'Conclusión'],
        required: false
    },
    descripcion: {
        type: String,
        required: false
    },
    fecha: {
        type: Date,
        default: Date.now,
        required: true
    },
    registerBy: {
        type: Schema.Types.ObjectId,
        ref: 'Colaborador',
        required: false
    },
    registerByName: {
        type: String,
        required: false
    },
    fechaHoraCita: {
        type: Date,
        required: false
    },
    subOpcionConclusion: {
        type: String,
        required: false
    },
    subOpcionNuevoSocio: {
        type: String,
        required: false
    },
    cantidadSolicitada: {
        type: String,
        required: false
    }
}, { timestamps: true });

const ProspectoSchema = Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    branch: { type: String, required: true },
    email: { type: String, required: false },
    phone: { type: String, required: true },
    dob: { type: Date, required: true },
    interested_product: { type: String, required: true },
    referal_source: { type: String, required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'Colaborador', required: false },
    registerBy: { type: Schema.Types.ObjectId, ref: 'Colaborador', required: true },
    dateControl: { type: Date, required: false },
    lastDateControl: { type: Date, required: false },
    KPI: { type: String, required: false },
    requested_amount: { type: String, required: false },
    eventos: [EventoSchema]
}, { timestamps: true });

module.exports = model('Prospecto', ProspectoSchema);