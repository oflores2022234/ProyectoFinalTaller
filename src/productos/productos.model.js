import mongoose, { mongo } from "mongoose";

const ProductoSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: [true, "The name of the product is obligatory"],
    },
    descripcion: {
        type: String,
        required: [true, "The description is obligatory"],
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true,
    },
    precio: {
        type: Number,
        required: [true, "the price is obligatory"],
    },
    stock: {
        type: Number,
        required: [true, "The stock is obligatory"],
    },
    estado: {
        type: Boolean,
        default: true,
    },
});

ProductoSchema.methods.toJSON = function(){
    const { __v, _id, ...producto} = this.toObject();
    producto.uid = _id;
    return producto;
}

export default mongoose.model('Producto', ProductoSchema);