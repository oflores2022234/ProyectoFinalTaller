import Carrito from './carrito.model.js';	
import Producto from '../productos/productos.model.js';
import { validationResult } from 'express-validator';

export const carritoPost = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { nombreProducto, cantidad } = req.body;
    const usuario = req.usuario;

    try {
        const producto = await Producto.findOne({nombre: nombreProducto});

        if(!producto){
            return res.status(404).json({msg: 'Producto no encontrado'});
        }

        if(producto.stock < cantidad){
            return res.status(400).json({msg: 'Stock insuficiente'});
        }

        let carrito = await Carrito.findOne({ usuario });

        if(!carrito){
            carrito = new Carrito({
                usuario,
                productos: []
            });
        }

        const productoIndex = carrito.productos.findIndex(producto => producto.nombreProducto === nombreProducto);

        if(!productoIndex !== -1){
            carrito.productos[productoIndex].cantidad += cantidad;
        }else{
            carrito.productos.push({nombreProducto, cantidad});
        }

        await carrito.save();

        res.status(201).json({msg: 'Producto agregado al carrito'});
    } catch (error) {
        console.log(`Error al agregar producto al carrito: `,error);
        res.status(500).json({msg: 'Error al agregar producto al carrito'});
    }
}