const express = require('express');
const router  = express.Router();
const multer = require('multer');
const upload  = multer({ dest: 'uploads/' });
const { check } = require('express-validator');
const { 
    getProspectos, 
    metricasProspectos, 
    filterProspectos, 
    obtenerMetricasGrafica, 
    recentActivity, 
    incomingAppointments, 
    incomingAllAppointments, 
    createNotify, 
    getReferalSource,
    getSemaforo,
    createProspecto,
    xlsxProspectos,
    getTiposDisponibles,
    addEvento,
    assignProspecto
} = require('../controllers/prospecto');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

router.use(validarJWT);

router.post('/upload-excel', upload.single('file'), xlsxProspectos);
router.post('/reminder', createNotify);

router.get('/prospectos/:id/eventos/disponibles', getTiposDisponibles);
router.get('/prospectos', getProspectos);
router.get('/metrics', metricasProspectos);
router.get('/filter', filterProspectos);
router.get('/graphic', obtenerMetricasGrafica);
router.get('/recent-activity', recentActivity);
router.get('/incoming-appointments', incomingAppointments);
router.get('/incoming-all-appointments', incomingAllAppointments);
router.get('/referal-source', getReferalSource);
router.get('/semaforo', getSemaforo);

router.patch('/prospecto/:id/eventos', addEvento);

router.post(
    '/nuevo-prospecto', 
    [
        check('firstName', 'El Nombre es Obligatorio').trim().not().isEmpty().escape(),
        check('lastName', 'El Apellido es Obligatorio').trim().not().isEmpty().escape(),
        check('branch', 'La sucursal es Obligatoria').trim().not().isEmpty().escape(),
        check('email', 'El Email es Obligatorio').trim().isEmail().escape(),
        check('phone', 'El numero de whatsapp debe contener 10 digitos').trim().isLength({min: 10}).escape(),
        check('dob', 'Fecha de nacimiento es obligatoria').trim().not().isEmpty().escape(),
        check('interested_product', 'Fecha de nacimiento es obligatoria').trim().not().isEmpty().escape(),
        check('referal_source', 'Fecha de nacimiento es obligatoria').trim().not().isEmpty().escape(),
        check('registerBy', 'Fecha de nacimiento es obligatoria').trim().not().isEmpty().escape(),
        check('dateControl', 'Fecha de nacimiento es obligatoria').trim().not().isEmpty().escape(),
        check('lastDateControl', 'Fecha de nacimiento es obligatoria').trim().not().isEmpty().escape(),
        validarCampos
    ], 
    createProspecto,
);




module.exports = router;