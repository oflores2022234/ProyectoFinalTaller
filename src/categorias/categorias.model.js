import mongoose, { mongo } from 'mongoose';

const CategoriaSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: [true, "The category is obligatory"],
    },
    descripcion: {
        type: String,
        required: [true, "The description is obligatory"],
    },
    estado: {
        type: Boolean,
        default: true,
    },
});

export default mongoose.model('Categoria', CategoriaSchema);