const express = require('express');
const router  = express.Router();
const { validarJWT } = require('../middlewares/validar-jwt');
const { getNotifications, onOpeNotification, clearNotifications } = require('../controllers/notificaciones');

router.use(validarJWT);

router.get('/notificaciones', getNotifications);
router.patch(`/notificaciones/:id/read`, onOpeNotification);
router.patch(`/notificaciones/clear-all`, clearNotifications);

module.exports = router;