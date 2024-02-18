const { request, response } = require('express');
const Usuario = require("../models/usuario");


const login = async (req = request, res = response) => {
    const { correo, password } = req.body;

    try {
        
    } catch (e) {
        console.log(e);
        res.status(500).json(){
            msg
        }
    }

}

module.exports = {
    login
}