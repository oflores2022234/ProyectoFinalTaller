import Factura from './facturas.model.js';
import Carrito from '../carrito/carrito.model.js';

export const facturaPost = async (req, res) => {
    const usuario = req.usuario;

    try {

        const carrito = await Carrito.findOne({ usuario });

        if(!carrito){
            return res.status(400).json({ msg: 'No se encontro nungún carrito para el usuario'});
        }

        const precioFinal = carrito.productos.reduce((total, producto) => total + producto.subTotal, 0);    

        const nuevaFactura = new Factura({
            usuario,
            carrito: carrito._id,
            precioFinal
        });

        await nuevaFactura.save();

        carrito.productos = []; 
        await carrito.save();

        return res.status(201).json({ msg: 'Factura creada exitosamente '});
        
    } catch (error) {
        console.error('Error al crear la factura', error);
        res.status(500).json({ error: 'Error al crear la factura'});
    }
};