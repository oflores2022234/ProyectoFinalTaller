const Categoria = require('../models/categoria');
const { response, request} = require('express');

const categoriaPost = async (req, res) => {
    const {nombre, descripcion} = req.body;
    const categoria = new Categoria({nombre, descripcion});

    await categoria.save();
    res.status(202).json({
        categoria
    });
}

module.exports = {
    categoriaPost
}