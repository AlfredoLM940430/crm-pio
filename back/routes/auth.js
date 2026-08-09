const express = require('express');
const { validarCampos } = require('../middlewares/validar-campos');
const { check } = require('express-validator');
const { sessionLogin } = require('../controllers/colaborador');
const router  = express.Router();

router.post(
    '/auth/login',
    [
        check('email', 'El Email es Obligatorio').trim().isEmail().escape(),
        check('password', 'La contraseña debe contener al menos 6 caracteres').trim().isLength({min:6}).escape(),
        validarCampos,
    ],
    sessionLogin
)

module.exports = router;