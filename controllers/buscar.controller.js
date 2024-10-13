const { response, request } = require("express");
const { ObjectId } = require("mongoose").Types;
const { Usuario, Categoria, Producto } = require("../models");

const colecciones = ["usuarios", "categoria", "productos", "roles"];

const buscarUsuarios = async (ter = "", res = response) => {
  const esMongoID = ObjectId.isValid(ter);

  if (esMongoID) {
    const usuario = await Usuario.findById(ter);
    return res.json({
      results: usuario ? [usuario] : [],
    });
  }

  const regex = new RegExp(ter, "i");

  const usuarios = await Usuario.find({
    $or: [{ nombre: regex }, { correo: regex }],
    $and: [{ estado: true }],
  });

  return res.json({
    results: usuarios,
  });
};

const buscarCategoria = async (ter = "", res = response) => {
  const esMongoID = ObjectId.isValid(ter);

  if (esMongoID) {
    const categoria = await Categoria.findById(ter);
    return res.json({
      results: categoria ? [categoria] : [],
    });
  }

  const regex = new RegExp(ter, "i");

  const categorias = await Categoria.find({
    nombre: regex,
    estado: true,
  });

  return res.json({
    results: categorias,
  });
};

const buscarProducto = async (ter = "", res = response) => {
  const esMongoID = ObjectId.isValid(ter);

  if (esMongoID) {
    const producto = await Producto.findById(ter);
    return res.json({
      results: producto ? [producto] : [],
    });
  }

  const regex = new RegExp(ter, "i");

  const productos = await Producto.find({
    $or: [{ nombre: regex }],
    $and: [{ estado: true }],
  });

  return res.json({
    results: productos,
  });
};

module.exports.buscar = (req, res = response) => {
  const { col, ter } = req.params;

  if (!colecciones.includes(col))
    return res
      .status(400)
      .json({ msg: `las colecciones permitidas son: ${colecciones}` });

  switch (col) {
    case "usuarios":
      buscarUsuarios(ter, res);
      break;

    case "categoria":
      buscarCategoria(ter, res);
      break;

    case "productos":
      buscarProducto(ter, res);
      break;

    default:
      res.status(500).json({ msg: "no incluido" });
      break;
  }
};
