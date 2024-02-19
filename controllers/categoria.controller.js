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
/*
const categoriasGet = async (req, res = response) => {
    const {limite, desde} = req.query;
    const query = {estado: true};

    const [total, categorias] = await Promise.all({

    })
}
*/
module.exports = {
    categoriaPost
}