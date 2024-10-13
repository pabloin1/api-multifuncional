const dbValidators = require("./db-validators");
const googleVerify = require("./google-verify");
const valiadarJwt = require("./generar-jwt");
const subirArchivo = require("./subir-archivo");

module.exports = {
  ...valiadarJwt,
  ...googleVerify,
  ...dbValidators,
  ...subirArchivo,
};
