import { Router } from "express";
import { check } from "express-validator";

import {
    productosPost,
    productosGet,
    productoPut,
    productoDelete,
    controlInventario,
    productosAgotados,
    buscarProductosPorNombre,
    catalogoProductosPorCategoria
} from "./productos.controller.js";

import {
    existeNombreProducto,
    validarPrecio,
    validarStock,
    existeProductoById
} from "../helpers/db-validators.js"

import { validarCampos } from "../middlewares/validar-campos.js"
import { validarJWT } from "../middlewares/validar-jwt.js"
import { esAdmin } from "../middlewares/verificar-role.js";
import { esCliente } from "../middlewares/verificar-role.js";

const router = Router();

router.get("/", productosGet);
router.get("/control-inventario", esAdmin, controlInventario);
router.get("/productos-agotados", esAdmin, productosAgotados);
router.get("/buscar", esCliente, buscarProductosPorNombre);
router.get("/categoria/:categoria", esCliente, catalogoProductosPorCategoria);

router.post(
    "/",
    [
        validarJWT,
        esAdmin,
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
        esAdmin,
        check("id", "Id no valid").isMongoId(),
        check("id").custom(existeProductoById),
        validarCampos,
    ], productoPut
);

router.delete(
    "/:id",
    [
        validarJWT,
        esAdmin,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeProductoById),
        validarCampos,
    ],
    productoDelete
);

export default router;