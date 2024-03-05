import { Router } from "express";
import { check } from "express-validator";

import {
    categoriasPost,
    categoriasGet,
    categoriasPut,
    categoriasDelete
} from "./categorias.controller.js";

import {
    existenteCategoria,
    existeCategoriaById
} from "../helpers/db-validators.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get("/", categoriasGet);

router.post(
    "/",
    [
        check("nombre").custom(existenteCategoria),
        check('descripcion', "The description is obligatory").not().isEmpty(),
        validarCampos,
    ], categoriasPost );

router.put(
    "/:id",
    [
        check("id", "Id no valid").isMongoId(),
        check("id").custom(existeCategoriaById),
        validarCampos,
    ], categoriasPut
);

router.delete(
    "/:id",
    [
        validarJWT,
        check("id", "Id no valid").isMongoId(),
        check("id").custom(existeCategoriaById),
        validarCampos,
    ], categoriasDelete);

export default router;