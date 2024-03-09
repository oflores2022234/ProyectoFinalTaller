import { Router } from "express";
import { check } from "express-validator";
import {
    carritoPost,
    getCarrito,
    deleteCarrito,
    } from "./carrito.controller.js";

import { validarJWT } from "../middlewares/validar-jwt.js";
import { esCliente } from "../middlewares/verificar-role.js";

const router = Router();

router.get("/", validarJWT, getCarrito);
router.delete("/", validarJWT, esCliente, deleteCarrito);

router.post(
    "/",
    [
        validarJWT,
        esCliente,
        check("nombreProducto", "El nombre del producto es obligatorio").not().isEmpty(),
        check("cantidad", "La cantidad es obligatoria").not().isEmpty(),
    ],
    carritoPost
);



export default router;
