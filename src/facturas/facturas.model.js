import mongoose, { mongo } from "mongoose";

const FacturaSchema = mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    },
    carrito: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Carrito',
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Factura", FacturaSchema);    