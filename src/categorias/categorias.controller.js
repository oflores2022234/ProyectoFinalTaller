import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import Categoria from './categorias.model.js';

export const categoriasPost = async (req, res) => {
    const { nombre, descripcion } = req.body;
    const categoria = new Categoria( {nombre, descripcion} );

    await categoria.save();
    res.status(200).json({
        categoria
    });
}

export const categoriasGet = async (req = request, res = response) => {
    const {limite, desde} = req.query;
    const query = {estado: true};

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        categorias
    });
}

export const categoriasPut = async (req, res = response) => {
    const { id } = req.params;
    const {_id, ...resto} = req.body;

    await Categoria.findByIdAndUpdate(id, resto);

    const categoria = await Categoria.findOne({_id: id});

    res.status(200).json({
        msg: "Categoty Update",
        categoria
    });
};

export const categoriasDelete = async (req, res) => {
    const {id} = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false});
    res.status(200).json({msg:'Categoria to delete', categoria});
}