const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');

const {
    categoriaPost} = require('../controllers/categoria.controller');

const { existeCategoriaById} = require('../helpers/db-validators');

const router = Router();

router.post(
    "/",
    [
        check("nombre", "El nombre no puede estar vacío").not().isEmpty(),
        check("descripcion", "La descripcion no puede ir vacía").not().isEmpty(),
        validarCampos,
    ], categoriaPost);


module.exports = router;