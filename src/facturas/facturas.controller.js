import Factura from './facturas.model.js';
import Carrito from '../carrito/carrito.model.js';
import { validationResult } from 'express-validator';

export const crearFactura = async (req, res) => {
    const usuario = req.usuario;
    const idCarrito = req.carrito;

    try {

        const carrito = await Carrito.findOne({ idCarrito });

        if (!carrito) {
            return res.status(404).json({ msg: 'No se encontró ningún carrito para el usuario' });
        }


        const precioTotal = carrito.productos.reduce((total, producto) => total + producto.subtotal, 0);


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


export const obtenerProductosMasVendidos = async (req, res) => {
    try {

        const facturas = await Factura.find().populate('carrito');


        const productosVendidos = new Map();


        for (const factura of facturas) {
            for (const producto of factura.carrito.productos) {
                const nombreProducto = producto.nombreProducto;
                const cantidad = producto.cantidad;


                if (productosVendidos.has(nombreProducto)) {
                    productosVendidos.set(nombreProducto, productosVendidos.get(nombreProducto) + cantidad);
                } else { 
                    productosVendidos.set(nombreProducto, cantidad);
                }
            }
        }


        const productosOrdenados = Array.from(productosVendidos, ([nombreProducto, cantidad]) => ({
            nombreProducto,
            cantidad
        }));


        productosOrdenados.sort((a, b) => b.cantidad - a.cantidad);

        return res.status(200).json({ productosMasVendidos: productosOrdenados });
    } catch (error) {
        console.error('Error al obtener los productos más vendidos:', error);
        res.status(500).json({ error: 'Error al obtener los productos más vendidos' });
    }
};