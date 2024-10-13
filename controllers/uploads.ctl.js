const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);
const { response } = require("express");
const { subirArchivo } = require("../helpers");
const { Producto, Usuario } = require("../models");

module.exports.cargarArchivo = async (req, res = response) => {
  try {
    const nombre = await subirArchivo(req.files, undefined, "imgs");
    res.json({
      nombre,
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports.actualizarImg = async (req, res = response) => {
  const { col, id } = req.params;

  let modelo;

  switch (col) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo)
        return res.status(400).json({ msg: "no existe en base de datos" });

      break;

    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo)
        return res.status(400).json({ msg: "no existe en base de datos" });

      break;

    default:
      return res.status(500).json({ msg: "no existe" });
  }

  //limpiar imagenes previas
  if (modelo.img) {
    //borrar la imagen del servidor
    const pathImg = path.join(__dirname, "../uploads", col, modelo.img);
    if (fs.existsSync(pathImg)) {
      fs.unlinkSync(pathImg);
    }
  }

  const nombre = await subirArchivo(req.files, undefined, col);
  modelo.img = nombre;
  await modelo.save();

  res.json({ modelo });
};

//-------------------------------------------------------------------------------
module.exports.actualizarImgCloudinary = async (req, res = response) => {
  const { col, id } = req.params;

  let modelo;

  switch (col) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo)
        return res.status(400).json({ msg: "no existe en base de datos" });

      break;

    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo)
        return res.status(400).json({ msg: "no existe en base de datos" });

      break;

    default:
      return res.status(500).json({ msg: "no existe" });
  }

  //limpiar imagenes previas
  if (modelo.img) {
    const nombreArr = modelo.img.split("/");
    const nombre = nombreArr[nombreArr.length - 1];
    const [public_id] = nombre.split(".");

    cloudinary.uploader.destroy(public_id);
  }

  const { tempFilePath } = req.files.archivo;

  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

  modelo.img = secure_url;
  await modelo.save();

  res.json({ modelo });
};

module.exports.mostrarImg = async (req, res = response) => {
  const { col, id } = req.params;

  let modelo;

  switch (col) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo)
        return res.status(400).json({ msg: "no existe en base de datos" });

      break;

    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo)
        return res.status(400).json({ msg: "no existe en base de datos" });

      break;

    default:
      return res.status(500).json({ msg: "no existe" });
  }

  if (modelo.img) {
    //mostrar la imagen del servidor
    const pathImg = path.join(__dirname, "../uploads", col, modelo.img);

    if (fs.existsSync(pathImg)) {
      return res.sendFile(pathImg);
    }
  }

  const placeHolder = path.join(__dirname, "../assets", "no-image.jpg");

  res.sendFile(placeHolder);
};
