import { Router } from "express";
import { check } from "express-validator";

import {
    productosPost
} from "./productos.controller.js";

import {
    existeNombreProducto,
    validarPrecio,
    validarStock
} from "../helpers/db-validators.js"

import { validarCampos } from "../middlewares/validar-campos.js"
import { validarJWT } from "../middlewares/validar-jwt.js"

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        check("nombre", "The name isnt optional").not().isEmpty(),
        check("nombre").custom(existeNombreProducto),
        check("descripcion", "The descripcion isnt opcional").not().isEmpty(),
        check("precio", "The price isnt optional").not().isEmpty(),
        check("precio").custom(validarPrecio),
        check("stock", "The stock isnt optional").not().isEmpty(),
        check("stock").custom(validarStock),
        validarCampos   
    ], productosPost
);

export default router;