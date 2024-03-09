import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { esAdmin } from "../middlewares/verificar-role.js";
import {
    crearFactura,
    obtenerFacturasUsuario,
    obtenerDetallesFactura,
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

export default router;