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
        
        if (resto.categoria && !mongoose.Types.ObjectId.isValid(resto.categoria)) {
            
            const categoria = await Categorias.findOne({ nombre: resto.categoria });

            if (!categoria) {
                return res.status(404).json({ msg: 'Categoría no encontrada' });
            }

            resto.categoria = categoria._id; 
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
    try {
        const productosAgotados = await Productos.find({ stock: 0 }, 'nombre descripcion stock');
        res.status(200).json(productosAgotados);
    } catch (error) {
        console.error('Error al obtener productos agotados:', error);
        res.status(500).json({ error: 'Error al obtener productos agotados' });
    }
};


export const buscarProductosPorNombre = async (req, res) => {
    const { nombre } = req.query;

    try {
        const productos = await Productos.find({ nombre: { $regex: new RegExp(nombre, 'i') } });

        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al buscar productos por nombre:', error);
        res.status(500).json({ error: 'Error al buscar productos por nombre' });
    }
};

export const catalogoProductosPorCategoria = async (req, res) => {
    const { categoria } = req.params;

    try {
        
        const categoriaEncontrada = await Categorias.findOne({ nombre: categoria });

        if (!categoriaEncontrada) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        
        const productos = await Productos.find({ categoria: categoriaEncontrada._id });

        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al obtener el catálogo de productos por categoría:', error);
        res.status(500).json({ error: 'Error al obtener el catálogo de productos por categoría' });
    }
};


export const modificarStockProducto = async (req, res) => {
    const { productoId } = req.params;
    const { cantidad } = req.body;

    try {

        const producto = await Producto.findById(productoId);

        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }


        if (cantidad > 0) {

            producto.stock += cantidad;
            await producto.save();
            return res.status(200).json({ msg: 'Stock del producto aumentado exitosamente' });
        } else if (cantidad < 0) {

            const cantidadAbsoluta = Math.abs(cantidad);
            if (producto.stock < cantidadAbsoluta) {
                return res.status(400).json({ msg: 'No hay suficiente stock para restar' });
            }
            producto.stock -= cantidadAbsoluta;
            await producto.save();
            return res.status(200).json({ msg: 'Stock del producto disminuido exitosamente' });
        } else {
            return res.status(400).json({ msg: 'La cantidad debe ser positiva o negativa' });
        }
    } catch (error) {
        console.error('Error al modificar el stock del producto:', error);
        res.status(500).json({ error: 'Error al modificar el stock del producto' });
    }
};