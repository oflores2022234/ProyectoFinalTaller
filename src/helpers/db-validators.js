
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

export const existeNombreProducto = async (nombre = '') => {
    const existeProducto = await Productos.findOne({nombre});
    if(existeProducto){
        throw new Error(`El nombre ${nombre} ya fue registrado`);
    }
}

export const validarPrecio = async (precio = "") => {
    if(precio === null || isNaN(precio) || precio < 0){
        throw new Error('The price must be a valid number greater than 0');
    }

    if(precio < 0){
        throw new Error('The price cannot be negative');
    }

    if(precio == 0){
        throw new Error('The price cannot be 0')
    }
}

export const validarStock = async (stock = "") => {
    if(stock === null || isNaN(stock) || stock < 0){
        throw new Error('The stock must be a valid number greater than 0');
    }

    if(!Number.isInteger(stock)){
        throw new Error('The stock must be a whole number');
    }

    if(stock < 0){
        throw new Error('The stock cannot be a negative');
    }

    if(stock == 0){
        throw new Error('The stock cannot be 0')
    }
}