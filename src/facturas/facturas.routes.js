import { Router } from "express";
import { check } from "express-validator";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { esAdmin } from "../middlewares/verificar-role.js";
import {
    facturaPost
} from "./facturas.controller.js";

const router = Router();

router.post(
    '/', 
    [
        validarJWT, 
        esAdmin, 
        check('carritoId', 'El carritoId es obligatorio').not().isEmpty(),
        check('carritoId', 'El carritoId es obligatorio').isMongoId(),
    ], facturaPost );

    export default router;
