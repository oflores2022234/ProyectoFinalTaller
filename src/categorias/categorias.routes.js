import { Router } from "express";
import { check } from "express-validator";

import {
    categoriasPost
} from "./categorias.controller.js";

import {
    existenteCategoria
    //existeCategoriaBI
} from "../helpers/db-validators.js";
import { validarCampos } from "../middlewares/validar-campos.js";
//import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.post(
    "/",
    [
        check("nombre").custom(existenteCategoria),
        check('descripcion', "The description is obligatory").not().isEmpty(),
        validarCampos,
    ], categoriasPost );

export default router;