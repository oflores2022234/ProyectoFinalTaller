const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuarios');
const { response, request } = require('express');

const usuarioPost = async (req, res) => {
    const {nombre, correo, telefono, password, role} = req.body;
    const usuario = new Usuario({nombre, correo, telefono, password, role});

    if(password){
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(password, salt);
    }

    await usuario.save();
    res.status(202).json({
        usuario
    });

}