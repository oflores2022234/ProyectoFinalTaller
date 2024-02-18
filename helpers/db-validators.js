const Role = require('../models/role');
const Usuario = require('../models/usuarios');

const esRoleValido = async (role = '') =>{
    const existeRol = await Role.findOne({role});
    if(!existeRol){
        throw new Error(`El role ${ role } no existe en la base de datos`);
        
    }
}

module.exports = {
    esRoleValido
}