 const jwt = require('jsonwebtoken');

 const generarToken = (id, name) => {

    return new Promise((resolve, reject) => {

        const payload = {id, name};

        jwt.sign(payload, process.env.SECRET_JWT_SEED, {
            //expiresIn: '5s'
            expiresIn: '7hr'
        }, (error, token) => {
            if(error) {
                console.log(error);
                reject('No se pudo generar el token')
            }
            resolve(token);
        });
    });
 }

 module.exports = {
    generarToken,
 }