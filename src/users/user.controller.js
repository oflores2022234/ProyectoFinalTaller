import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import User from './user.model.js';

export const usuariosPost = async (req, res) => {
    const {nombre, correo, password, role} = req.body;
    const usuario = new User( {nombre, correo, password, role} )

    const salt = bcryptjs.getSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    await usuario.save();
    
    res.status().json({
        usuario
    })

}