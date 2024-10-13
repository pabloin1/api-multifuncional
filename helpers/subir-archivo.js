const path = require("path");
const { v4: uuidv4 } = require('uuid')


module.exports.subirArchivo = (files,extensioneValidas = ["png", "jpg", "jpeg", "gif", "pdf"], carpeta = '') => {
  return new Promise((resolve, reject) => {
    const { archivo } = files;

    const nombreCortado = archivo.name.split(".");
    const extension = nombreCortado[nombreCortado.length - 1];

    if (!extensioneValidas.includes(extension)) {
        return reject( `La extension ${extension} no es valida - ${extensioneValidas}`)
    }

    const nombreTemp = uuidv4() + "." + extension;
    const uploadPath = path.join(__dirname, "../uploads/",carpeta, nombreTemp);

    archivo.mv(uploadPath, (err) => {
      if (err) {
        reject(err)
      }

      resolve( nombreTemp)
    });


  });
};
