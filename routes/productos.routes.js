const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos, validarJWT } = require("../middlewares/");
const {
  crearProducto,
  obtenerProductos,
  actualizarProducto,
  eliminarProducto,
  obtenerProducto,
} = require("../controllers/productos.controller");
const {
  existeCategorioPorID,
  existeProductoPorID,
} = require("../helpers/db-validators");

const router = Router();

router.get("/", obtenerProductos);

router.get(
  "/:id",
  [check("id").custom(existeProductoPorID), validarCampos],
  obtenerProducto
);

router.post(
  "/",
  [
    validarJWT,
    check("nombre", "el nombre es obligatorio").not().isEmpty(),
    check("categoria", "no es un mongoId valido").isMongoId(),
    check("categoria", "la categoria es obligatoria").not().isEmpty(),
    check("categoria").custom(existeCategorioPorID),
    validarCampos,
  ],
  crearProducto
);

router.put(
  "/:id",
  [
    validarJWT,
    check("id").custom(existeProductoPorID),
    check("categoria", "no es un mongoId valido").isMongoId(),
    check("id").custom(existeProductoPorID),
    validarCampos,
  ],
  actualizarProducto
);


router.delete(
  "/:id",
  [
    check("id").custom(existeProductoPorID),
    check("categoria", "no es un mongoId valido").isMongoId(),
    validarCampos,
  ],
  eliminarProducto
);

module.exports = router;
