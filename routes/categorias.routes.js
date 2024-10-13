const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos, validarJWT } = require("../middlewares/");
const {
  crearCategoria,
  obtenerCategoria,
  actualizarCategoria,
  EliminarCategoria,
  obtenerCategorias,
} = require("../controllers/categorias.controller");
const { existeCategorioPorID } = require("../helpers/db-validators");

const router = Router();

router.get("/", obtenerCategorias);

router.get(
  "/:id",
  [check("id").custom(existeCategorioPorID), validarCampos],
  obtenerCategoria
);  

router.post(
  "/",
  [
    validarJWT,
    check("nombre", "el nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearCategoria
);

router.put(
  "/:id",
  [
    check("id").custom(existeCategorioPorID),
    check("nombre", "el nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  actualizarCategoria
);

router.delete(
  "/:id",
  [check("id").custom(existeCategorioPorID), validarCampos],
  EliminarCategoria
);

module.exports = router;
