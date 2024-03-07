import Productos from './productos.model.js';
import Categorias from '../categorias/categorias.model.js';
import { request, response } from 'express';
import mongoose from 'mongoose';

export const productosPost = async (req, res) => {
    const data = req.body;

    try {
        const categoria = await Categorias.findOne({nombre: data.categoria});

        if(!categoria){
            return res.status(404).json({msg: 'Categoria no encontrada'});
        }

        const producto = new Productos({
            ...data,
            categoria:categoria._id
        });

        await producto.save();  

        categoria.productos.push(producto._id)
        await categoria.save();

        res.status(200).json({ 
            msg: 'Nuevo producto agregado',
            producto
        });    

        
    } catch (error) {
        console.error('Error , cannot add product', error);
        res.status(500).json({ error: 'Error, cannor add product'});
    }
}

export const productosGet = async (req, res) => {
    const { limite, desde} = req.query;

    try {
        const [total, productos] = await Promise.all([
            Productos.countDocuments({ estado: true }),
            Productos.find({ estado: true })
                .populate('categoria', 'nombre') // Aquí cargamos el nombre de la categoría
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            total,
            productos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error al obtener los productos.' });
    }
};

export const productoPut = async (req, res = response) => {
    const { id } = req.params;
    const {_id, ...resto} = req.body;

    // Verificar si el ID es un ObjectID válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: 'ID de producto no válido' });
    }

    try {
        // Verificar si el campo 'categoria' es un ObjectID válido
        if (resto.categoria && !mongoose.Types.ObjectId.isValid(resto.categoria)) {
            // Si el campo 'categoria' no es un ObjectID válido, buscar la categoría por su nombre
            const categoria = await Categorias.findOne({ nombre: resto.categoria });

            if (!categoria) {
                return res.status(404).json({ msg: 'Categoría no encontrada' });
            }

            resto.categoria = categoria._id; // Asignar el ID de la categoría al producto actualizado
        }

        const producto = await Productos.findByIdAndUpdate(id, resto, { new: true });

        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        res.status(200).json({
            msg: 'Producto actualizado',
            producto
        });

    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ msg: 'Error al actualizar el producto' });
    }
}

export const productoDelete = async (req, res) => {
    const {id} = req.params;

    const producto = await Productos.findByIdAndUpdate(id, { estado: false});

    res.status(200).json({msg:'producto a eliminar', producto });
}


export const controlInventario = async (req, res) => {
    try {
        const productos = await Productos.find({}, 'nombre stock descripcion');
        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al obtener el control de inventario:', error);
        res.status(500).json({ error: 'Error al obtener el control de inventario' });
    }
}

export const productosAgotados = async (req, res) => {
    
}