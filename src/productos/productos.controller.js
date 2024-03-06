import Productos from './productos.model.js';
import Categorias from '../categorias/categorias.model.js';

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
