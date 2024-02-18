const { Schema, model } = require('mongoose');


const UsuarioSchema = Schema({

    nombre:{
        type: String,
        require: [true, 'El nombre es obligatorio']
    },
    correo:{
        type: String,
        require: [true, 'El correo es obligatorio'],
        unique: true
    },
    telefono:{
        type: String,
        require: [true, 'El numero de telefono es obligatorio'],
        unique: true
    },
    password:{
        type: String,
        require: [true, 'La contraseña es obligatoria']
    },
    role:{
        type: String,
        require: true,
        enum: ["ADMIN_ROLE", "USER_ROLE"]
    },
    estado:{
        type: Boolean,
        default: true
    }


});

module.exports = model('Usuario', UsuarioSchema);