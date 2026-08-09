const express = require('express');
const router  = express.Router();
const { default: axios } = require('axios');
const bcrypt = require('bcryptjs');
const Colaborador = require('../models/Colaborador');
const { generarToken } = require('../helpers/jwt');

const createColaborador = async(req, res = express.response) => {

    const { password } = req.body;

    try {
        const colaborador = new Colaborador(req.body);
        const salt = bcrypt.genSaltSync(10);
        colaborador.password = bcrypt.hashSync(password, salt);

        const colaboradorGuardado = await colaborador.save();

        return res.status(201).json({
            ok: true,
            colaborador: colaboradorGuardado
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const sessionLogin = async(req, res = express.response) => {
    
    const {email, password} = req.body;

    try {
        const colaborador = await Colaborador.findOne({email})
        if(!colaborador) {
            return res.status(400).json({
                ok: false,
                msj: 'El colaborador no existe',   
            });
        } 

        const validPassword = bcrypt.compareSync(password, colaborador.password);
        if(!validPassword) {
            return res.status(400).json({
                ok: false,
                msj: 'Password incorrecta',
            })
        }

        const token = await generarToken(colaborador._id, colaborador.firstName);

        res.json({
            ok: true,
            token,
            userData: {
                id: colaborador._id,
                firstName: colaborador.firstName,
                lastName: colaborador.lastName,
                branch: colaborador.branch,
                userLevel: colaborador.userLevel,
            }
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msj: `Hable con el administrador, ${error}`,
        });
    }
}

const revalidarToken = async (req, res = express.response) => {
    const { uid } = req;

    try {
        const colaborador = await Colaborador.findById(uid);

        if (!colaborador) {
            return res.status(404).json({
                ok: false,
                msj: 'El colaborador ya no existe en la base de datos'
            });
        }

        const token = await generarToken(colaborador._id, colaborador.firstName);

        res.json({
            ok: true,
            token,
            data: {
                id: colaborador._id,
                firstName: colaborador.firstName,
                lastName: colaborador.lastName,
                branch: colaborador.branch,
                userLevel: colaborador.userLevel,
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msj: 'Hable con el administrador'
        });
    }
};

module.exports = {
    createColaborador,
    sessionLogin,
    revalidarToken,
}