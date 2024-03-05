import { Router } from "express";
import { check } from "express-validator";

import {
    productosPost
} from "./productos.controller.js";

import { validateFields } from "../middlewares/validate-fields.js"
import { validarJWT } from "../middlewares/validate-jwt.js"

const router = Router();

router.post(
    "/",
    [
        
    ]
)