const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { response, request } = require('express');


const usuariosPost = async (req, res) => {
    const {nombre, correo, password, role} = req.body;
    const usuario = new Usuario({nombre, correo, password, role});

    if(password){
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(password, salt);

    }

    await usuario.save();
    res.status(202).json({
        usuario
    });
}

const usuarioGet = async (req, res = response) => {
    const {limite, desde} = req.query;
    const query = {estado: true};

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        usuarios
    });
}



module.exports = {
    usuariosPost,
    usuarioGet
}
