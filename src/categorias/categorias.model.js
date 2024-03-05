import mongoose from 'mongoose';

const CategoriaSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: [true, "The category is obligatory"],
    },
    descripcion: {
        type: String,
        required: [true, "The description is obligatory"],
    },
    productos: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true
    },
    estado: {
        type: Boolean,
        default: true,
    },
});

CategoriaSchema.methods.toJSON = function(){
    const { __v, _id, ...categoria} = this.toObject();
    categoria.uid = _id;
    return categoria;
}

export default mongoose.model('Categoria', CategoriaSchema);