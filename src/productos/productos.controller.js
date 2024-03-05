import Productos from './productos.model.js';
import Categorias from '../categorias/categorias.model.js';

export const productosPost = async (req, res) => {
    const { nombre, descripcion, categoriaI, precio, stock} = req.body;

    try {
        const categoria = await Categorias.findById(categoriaI);
        /*
        probar luego con findOne para llamar por nombre en la linea 8
        const categoria = await Categorias.findById(categoriaI);
        */

        if(!categoria){
            return res.status(404).json({msg: 'Categoria no encontrada'});
        }

        const producto = new Productos({
            nombre,
            descripcion,
            categoria: categoriaI,
            precio,
            stock
        });

        await producto.save();

        res.status(201).json({
            msg: 'Producto agregado correctamente',
            producto: {
                ...producto.toObject(),
                nombreCategoria: categoria.nombre,
            }
        });
        
    } catch (error) {
        console.error('Error , cannot add product', error);
        res.status(500).json({ error: 'Error, cannor add product'});
    }
}