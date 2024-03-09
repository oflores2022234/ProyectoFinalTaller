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
import { esAdmin } from "../middlewares/verificar-role.js";

const router = Router();

router.get("/", categoriasGet);

router.post(
    "/",
    [
        validarJWT,
        esAdmin,
        check("nombre").custom(existenteCategoria),
        check('descripcion', "The description is obligatory").not().isEmpty(),
        validarCampos,
    ], categoriasPost );

router.put(
    "/:id",
    [
        validarJWT,
        esAdmin,
        check("id", "Id no valid").isMongoId(),
        check("id").custom(existeCategoriaById),
        validarCampos,
    ], categoriasPut
);

router.delete(
    "/:id",
    [
        validarJWT,
        esAdmin,
        check("id", "Id no valid").isMongoId(),
        check("id").custom(existeCategoriaById),
        validarCampos,
    ], categoriasDelete);

export default router;