import Productos from './productos.model.js';
import Categorias from '../categorias/categorias.model.js';
import { request, response } from 'express';

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
    const { limite = 10, desde = 0 } = req.query;

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

/*export const productoPut = (req, res = response) => {
    const { id } =
}*/