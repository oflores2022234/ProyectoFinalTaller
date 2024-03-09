export const esAdmin = (req, res, next) => {
    const user = req.usuario;

    if(user.role === "ADMIN_ROLE") return next();

    return res.status(400).json({
        msg: "No tienes acceso, solo Administradores"
    });
};

export const esCliente = (req, res, next) => {
    const usuario = req.usuario;

    if(usuario.role === "CLIENT_ROLE") return next();

    return res.status(400).json({
        msg: "No tienes acceso, solo Clientes"
    });
};