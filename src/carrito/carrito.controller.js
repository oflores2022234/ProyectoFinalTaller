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

        // Calcular el subtotal y el precio del producto
        const precio = producto.precio;
        const subtotal = cantidad * precio;

        const carritoExistente = await Carrito.findOne({ usuario });

        if (carritoExistente) {
            const productoExistenteIndex = carritoExistente.productos.findIndex(producto => producto.nombreProducto === nombreProducto);

            if (productoExistenteIndex !== -1) {
                carritoExistente.productos[productoExistenteIndex].cantidad += cantidad;
                carritoExistente.productos[productoExistenteIndex].subtotal += subtotal;
            } else {
                carritoExistente.productos.push({ nombreProducto, cantidad, precio, subtotal });
            }

            await carritoExistente.save();

        } else {
            const nuevoCarrito = new Carrito({
                usuario,
                productos: [{ nombreProducto, cantidad, precio, subtotal }]
            });

            await nuevoCarrito.save();
        }

        producto.stock -= cantidad;
        await producto.save();

        return res.status(200).json({ mensaje: 'Producto agregado al carrito' });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ msg: 'Error al agregar producto al carrito' });
    }
}

export const getCarrito = async (req, res) => {
    const usuario = req.usuario;

    try {
        const carrito = await Carrito.findOne({ usuario });

        if (!carrito) {
            return res.status(404).json({ msg: 'No se encontró ningún producto en el carrito' });
        }

        // Calcular el subtotal de cada producto y el precio total del carrito
        let precioTotal = 0;
        const productosEnCarrito = carrito.productos.map(producto => {
            const subtotal = producto.precio * producto.cantidad;
            precioTotal += subtotal;

            return {
                usuario: usuario.nombre,
                producto: producto.nombreProducto,
                cantidad: producto.cantidad,
                precio: producto.precio,
                subtotal: subtotal
            };
        });

        const carritoId = carrito._id;

        return res.status(200).json({ carritoId, productosEnCarrito, precioTotal });
    } catch (error) {
        console.error('Error al obtener los productos en el carrito:', error);
        res.status(500).json({ error: 'Error al obtener los productos en el carrito' });
    }
};

export const deleteCarrito = async (req, res) => {
    const { nombreProducto } = req.query;
    const usuario = req.usuario;

    try {
        const carritoExistente = await Carrito.findOne({ usuario });

        if (!carritoExistente) {
            return res.status(404).json({ msg: 'Carrito no encontrado para este usuario' });
        }

        const productoIndex = carritoExistente.productos.findIndex(item => item.nombreProducto === nombreProducto);

        if (productoIndex === -1) {
            return res.status(404).json({ msg: 'Producto no encontrado en el carrito' });
        }

        const cantidad = carritoExistente.productos[productoIndex].cantidad;

        carritoExistente.productos.splice(productoIndex, 1);

        await carritoExistente.save();

        await Producto.findOneAndUpdate(
            { nombre: nombreProducto },
            { $inc: { stock: cantidad } }
        );

        return res.status(200).json({ msg: 'Producto eliminado del carrito' });
        
    } catch (error) {
        console.error('Error al eliminar producto del carrito', error);
        res.status(500).json({ msg: 'Error al eliminar producto del carrito'});
    }
}