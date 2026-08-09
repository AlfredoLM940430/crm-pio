const mongoose = require('mongoose');

const NotificacionSchema = new mongoose.Schema({
    usuarioId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        default: null
    },
    prospectoId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Prospecto' 
    },
    tipoEvento: { type: String, required: true },
    branch: { type: String, required: true },
    titulo: { type: String, required: true },
    mensaje: { type: String, required: true },
    leida: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notificacion', NotificacionSchema);