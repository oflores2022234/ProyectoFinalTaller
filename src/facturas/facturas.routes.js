import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { esAdmin } from "../middlewares/verificar-role.js";
import {
    crearFactura,
    obtenerFacturasUsuario,
    obtenerDetallesFactura,
    obtenerProductosMasVendidos
} from "./facturas.controller.js";

const router = Router();

router.post(
    "/",
    validarJWT,
    esAdmin,
    crearFactura
);

router.get('/', validarJWT, obtenerFacturasUsuario);

router.get('/:facturaId', validarJWT, obtenerDetallesFactura);

router.get('/productos-mas-vendidos', validarJWT, obtenerProductosMasVendidos);
export default router;