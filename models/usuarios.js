const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({

    nombre:{
        type: String,
        require: [true, 'El nombre es obligatorio']
    }

})