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
        const producto = await Producto.findOne({ nombre: nombreProducto });

        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        if (producto.stock < cantidad) {
            return res.status(400).json({ msg: 'Stock insuficiente' });
        }

        const carritoExistente = await Carrito.findOne({ usuario });

        if (carritoExistente) {
            const productoExistenteIndex = carritoExistente.productos.findIndex(producto => producto.nombreProducto === nombreProducto);

            if (productoExistenteIndex !== -1) {
                carritoExistente.productos[productoExistenteIndex].cantidad += cantidad;
            } else {
                carritoExistente.productos.push({ nombreProducto, cantidad });
            }

            await carritoExistente.save();

        } else {
            const nuevoCarrito = new Carrito({
                usuario,
                productos: [{ nombreProducto, cantidad }]
            });

            await nuevoCarrito.save();
        }


        producto.stock -= cantidad;
        await producto.save();

        return res.status(200).json({ mensaje: 'Producto agregado al carrito' });
    } catch (error) {
        console.log(`Error al agregar producto al carrito: `,error);
        res.status(500).json({msg: 'Error al agregar producto al carrito'});
    }
}