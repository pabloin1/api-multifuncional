// middlewares/validar-archivo.js
const validarArchivoSubir = (req, res, next) => {
    // Verifica si 'req.files' existe y si contiene el archivo
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
      return res.status(400).json({
        msg: "No se ha cargado ningún archivo - validarArchivoSubir"
      });
    }
    // Si todo está correcto, continúa con el siguiente middleware/controlador
    next();
  };
  
  module.exports = {
    validarArchivoSubir
  };
  