const {response, request} = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response, next) => {

    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        return res.status(401).json({
            ok: false,
            id: 'token',
            msg: 'No hay token el a peticion',
        });
    }    

    try {
        const {id, name} = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        );

        req.uid = id
        req.name = name

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: false,
            id: 'token',
            msg: 'Token vencido o no valido',
        })
    }
}

module.exports = {
    validarJWT,
}