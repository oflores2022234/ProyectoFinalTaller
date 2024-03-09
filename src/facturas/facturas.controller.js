import Factura from './facturas.model.js';
import Carrito from '../carrito/carrito.model.js';
import { validationResult } from 'express-validator';

export const crearFactura = async (req, res) => {
    const usuario = req.usuario;

    try {
        // Obtener el carrito del usuario
        const carrito = await Carrito.findOne({ usuario });

        if (!carrito) {
            return res.status(404).json({ msg: 'No se encontró ningún carrito para el usuario' });
        }

        // Calcular el precio total sumando los subtotales de los productos en el carrito
        const precioTotal = carrito.productos.reduce((total, producto) => total + producto.subtotal, 0);

        // Crear la factura
        const nuevaFactura = new Factura({
            usuario,
            carrito: carrito._id,
            precioTotal
        });

        await nuevaFactura.save();

        return res.status(201).json({ msg: 'Factura creada exitosamente' });
    } catch (error) {
        console.error('Error al crear la factura:', error);
        res.status(500).json({ error: 'Error al crear la factura' });
    }
};

// Controlador para obtener todas las facturas de un usuario
export const obtenerFacturasUsuario = async (req, res) => {
    const idCarrito = req.carrito;

    try {
        const facturas = await Factura.find({ idCarrito }).populate('carrito');

        return res.status(200).json({ facturas });
    } catch (error) {
        console.error('Error al obtener facturas del usuario:', error);
        res.status(500).json({ msg: 'Error al obtener facturas del usuario' });
    }
};


// Controlador para obtener los detalles de una factura específica
export const obtenerDetallesFactura = async (req, res) => {
    const { facturaId } = req.params;

    try {
        const factura = await Factura.findById(facturaId).populate({
            path: 'carrito',
            populate: { path: 'productos' }
        });

        if (!factura) {
            return res.status(404).json({ msg: 'Factura no encontrada' });
        }

        return res.status(200).json({ factura });
    } catch (error) {
        console.error('Error al obtener detalles de la factura:', error);
        res.status(500).json({ msg: 'Error al obtener detalles de la factura' });
    }
};