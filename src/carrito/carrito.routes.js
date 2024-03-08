import { Router } from "express";
import { check } from "express-validator";
import { 
    carritoPost } from "./carrito.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        check("nombreProducto", "El nombre del producto es obligatorio").not().isEmpty(),
        check("cantidad", "La cantidad es obligatoria").not().isEmpty(),
    ],
    carritoPost
);

export default router;