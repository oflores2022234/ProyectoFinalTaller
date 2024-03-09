import mongoose from "mongoose";

const FacturaSchema = mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    carrito: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Carrito',
        required: true
    },
    precioTotal: {
        type: Number,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});


export default mongoose.model("Factura", FacturaSchema);    