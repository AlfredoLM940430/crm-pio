const express = require('express');
const router  = express.Router();
const { check } = require('express-validator');
const { createColaborador, revalidarToken } = require('../controllers/colaborador');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

router.use(validarJWT);

router.post(
    '/nuevo-colaborador', 
    [
        check('firstName', 'El Nombre es Obligatorio').trim().not().isEmpty().escape(),
        check('lastName', 'El Apellido es Obligatorio').trim().not().isEmpty().escape(),
        check('branch', 'La sucursal es Obligatoria').trim().not().isEmpty().escape(),
        check('email', 'El Email es Obligatorio').trim().isEmail().escape(),
        check('phone', 'El numero de whatsapp debe contener 10 digitos').trim().isLength({min: 10}).escape(),
        check('userLevel', 'El tipo de usuario es obligatorio').trim().not().isEmpty().escape(),
        check('registerBy', 'Usuario "BY" es obligatorio').trim().not().isEmpty().escape(),
        validarCampos
    ], 
    createColaborador,
);

router.get('/auth/me', revalidarToken);

module.exports = router;