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