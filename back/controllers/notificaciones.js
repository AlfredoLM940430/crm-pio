const Colaborador = require('../models/Colaborador');
const Notificacion = require('../models/Notificacion');
const Prospecto = require('../models/Prospecto');

const getNotifications = async (req, res) => {
    try {
        const userId = req.uid;

        const colaborador = await Colaborador
            .findById(userId)
            .select('userLevel branch')
            .lean();

        if (!colaborador) {
            return res.status(404).json({ 
                ok: false, 
                msg: 'Colaborador no encontrado' 
            });
        }

        const { userLevel, branch } = colaborador;

        if (userLevel === '7') {
            return res.status(200).json({
                ok: true,
                notifications: [],
                noLeidas: 0,
            });
        }

        const query = { leida: false };

        switch (userLevel) {
            case '2':
            case '3':
            case '4':
                break;

            case '5':
                if (branch) query.branch = branch;
                break;

            default:
                if (branch) query.branch = branch;
                query.$or = [
                    { usuarioId: userId },
                    { usuarioId: null },
                    { usuarioId: { $exists: false } }
                ];
                break;
        }

        const notifications = await Notificacion
            .find(query)
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            ok: true,
            notifications,
            noLeidas: notifications.length,
        });

    } catch (error) {
        console.error('Error al obtener notifications:', error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
};

const onOpeNotification = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);
        
        const notification = await Notificacion.findOneAndDelete(
            { _id: id, usuarioId: req.uid }
        );

        if (!notification) {
            return res.status(404).json({ 
                message: 'No se encontró ninguna notificación que coincida con ambos IDs.' 
            });
        }

        return res.status(200).json({ message: 'Notificación eliminada correctamente', notification });
    } catch (error) {
        return res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
}

const clearNotifications = async (req, res) => {
    try {
        const result = await Notificacion.updateMany(
            { usuarioId: req.uid, leida: false },
            { $set: { leida: true } }
        );

        if (result.matchedCount === 0) {
            console.log('nada');
            
            return res.status(404).json({ 
                ok: false,
                message: 'No se encontraron notificaciones pendientes por leer para este usuario.' 
            });
        }
        return res.status(200).json({
            
            ok: true,
            message: 'Notificaciones marcadas como leídas correctamente.',
            updatedCount: result.modifiedCount
        });
    } catch (error) {
        return res.status(500).json({ 
            ok: false, 
            message: 'Error en el servidor', 
            error: error.message 
        });
    }
}

module.exports = {
    getNotifications,
    onOpeNotification,
    clearNotifications
};