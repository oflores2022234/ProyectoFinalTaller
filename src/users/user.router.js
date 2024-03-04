import { Router } from "express";
import { check } from "express-validator";
import {

  usuariosPost,
  usuariosGet,
  usuariosPut,
  usuariosDelete

} from "./user.controller.js";
import {
  existenteEmail,
  esRoleValido,
  existeUsuarioById,
} from "../helpers/db-validators.js";
import { validarCampos } from "../middlewares/validar-campos.js";


const router = Router();

router.get("/", usuariosGet);

router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password debe ser mayor a 6 caracteres").isLength({
      min: 6,
    }),
    check("correo", "Este no es un correo válido").isEmail(),
    check("correo").custom(existenteEmail),
    check("role").custom(esRoleValido),
    validarCampos,
  ],
  usuariosPost
);

router.put(
    "/:id",
    [
      check("id", "No es un ID válido").isMongoId(),
      check("id").custom(existeUsuarioById),
      validarCampos,
    ],
    usuariosPut
  );

  router.delete(
    "/:id",
    [
      check("id", "No es un ID válido").isMongoId(),
      check("id").custom(existeUsuarioById),
      validarCampos,
    ],
    usuariosDelete
  );



export default router;