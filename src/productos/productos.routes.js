import { Router } from "express";
import { check } from "express-validator";

import {
    productosPost,
    productosGet,
    productoPut,
    productoDelete,
    controlInventario,
    productosAgotados,
    buscarProductosPorNombre
} from "./productos.controller.js";

import {
    existeNombreProducto,
    validarPrecio,
    validarStock,
    existeProductoById
} from "../helpers/db-validators.js"

import { validarCampos } from "../middlewares/validar-campos.js"
import { validarJWT } from "../middlewares/validar-jwt.js"

const router = Router();

router.get("/", productosGet);
router.get("/control-inventario", controlInventario);
router.get("/productos-agotados", productosAgotados);
router.get("/buscar", buscarProductosPorNombre);

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

router.put(
    "/:id",
    [
        validarJWT,
        check("id", "Id no valid").isMongoId(),
        check("id").custom(existeProductoById),
        validarCampos,
    ], productoPut
);

router.delete(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeProductoById),
        validarCampos,
    ],
    productoDelete
);

export default router;