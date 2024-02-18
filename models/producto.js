const { Schema, model} = require('mongoose');

const ProductoSchema = Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    descripcion:{
        type: String,
        required: [true, 'La descripcion es obligatoria']
    },
    precio:{
        type: Nunber,
        required: [true, 'El precio el obligatorio']
    },
    cantidad:{
        type: Number,
        required: [true, 'La cantidad es obligatoria']
    },
    categoria:{
        type: String,
        default: "none"
    },
    estado:{
        type: Boolean,
        default: true
    }
});

module.exports = model('Producto', ProductoSchema);