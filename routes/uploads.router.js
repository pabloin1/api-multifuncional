const { Router } = require("express");
const { check } = require("express-validator");
const {
  validarCampos,
  validarJWT,
  validarArchivoSubir,
} = require("../middlewares");
const {
  cargarArchivo,
  actualizarImg,
  mostrarImg,
  actualizarImgCloudinary,
} = require("../controllers/uploads.ctl");
const { coleccionesPer } = require("../helpers");

const router = Router();

router.get(
  "/servir/:col/:id",
  [
    check("id", "id no valido").isMongoId(),
    check("col").custom((c) => coleccionesPer(c, ["usuarios", "productos"])),
    validarCampos,
  ],
  mostrarImg
);

// Ruta para cargar archivo
router.post("/cargar", [validarArchivoSubir, validarCampos], cargarArchivo);

// Ruta para actualizar imagen
router.put(
  "/:col/:id",
  [
    validarArchivoSubir,
    check("id", "id no valido").isMongoId(),
    check("col").custom((c) => coleccionesPer(c, ["usuarios", "productos"])),
    validarCampos,
  ],
  actualizarImgCloudinary
);

module.exports = router;
