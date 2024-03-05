
import User from '../users/user.model.js'
import Categoria from '../categorias/categorias.model.js'
import Productos from '../productos/productos.model.js'



export const existenteEmail = async (correo = '') => {
    const existeEmail = await User.findOne({correo});
    if (existeEmail){
        throw new Error(`El email ${correo} ya fue registrado`);
    }
}

export const existeUsuarioById = async (id = '') => {
    const existeUsuario = await User.findById(id);
    if (!existeUsuario){
        throw new Error(`El ID: ${correo} No existe`);
    }
}

export const existenteCategoria = async (nombre = '') => {
    const existeCategoria = await Categoria.findOne({nombre});
    if(existeCategoria){
        throw new Error(`El nombre ${nombre} ya fue registrado`);
    }
}

export const existeCategoriaById = async (id = '') => {
    const existeCategoriaBI = await Categoria.findById(id);
    if (!existeCategoriaBI){
        throw new Error(`El ID: ${nombre} no existe`);
    }
}

export const existeNombreProeudto = async (nombre = '') => {
    const existeProducto = await Productos.findOne({nombre});
    if(existeProducto){
        throw new Error(`El nombre ${nombre} ya fue registrado`);
    }
}

//export const 