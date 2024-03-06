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
        //esta usamos el update may, 
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
        // Buscar la categoría que se va a eliminar
        const categoria = await Categoria.findById(id);
        if (!categoria) {
            return res.status(404).json({ msg: "Categoría no encontrada" });
        }

        // Buscar la categoría alternativa
        const categoriaAlternativa = await Categoria.findOne({ nombre: "Tecnología" }); // Aquí debes especificar el nombre de la categoría alternativa

        // Actualizar los productos relacionados asignándoles la categoría alternativa
        await Producto.updateMany({ idCategoria: id }, { $set: { idCategoria: categoriaAlternativa ? categoriaAlternativa._id : null } });

        // Cambiar el estado de la categoría a false
        const categoriaActualizada = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });

        res.status(200).json({ msg: "Categoría eliminada correctamente", categoria: categoriaActualizada });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};