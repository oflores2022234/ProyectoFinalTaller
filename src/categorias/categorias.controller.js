import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import Categoria from './categorias.model.js';
import Producto from '../productos/productos.model.js';

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
    const { _id, ...resto } = req.body;

    try {
        const categoriaActualizada = await Categoria.findByIdAndUpdate(id, resto, { new: true });

        await Producto.updateMany({ idCategoria: id }, { $set: { idCategoria: categoriaActualizada._id } });

        res.status(200).json({
            msg: "Category Update",
            categoria: categoriaActualizada
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const categoriasDelete = async (req, res) => {
    const { id } = req.params;

    try {

        const categoria = await Categoria.findById(id);
        if (!categoria) {
            return res.status(404).json({ msg: "Categoría no encontrada" });
        }


        const categoriaAlternativa = await Categoria.findOne({ nombre: "Camisas" });
        if (!categoriaAlternativa) {
            return res.status(404).json({ msg: "No se encontró una categoría alternativa válida" });
        }


        await Producto.updateMany({ categoria: id }, { $set: { categoria: categoriaAlternativa._id } });


        const categoriaActualizada = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });

        res.status(200).json({ msg: "Categoría eliminada correctamente", categoria: categoriaActualizada });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};