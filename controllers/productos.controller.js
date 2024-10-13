const { response, request } = require("express");
const { Producto } = require("../models");

module.exports.obtenerProductos = async (req, res = response) => {
  try {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, producto] = await Promise.all([
      Producto.countDocuments(query),
      Producto.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
        .populate("usuario", "nombre correo")
        .populate("categoria", "nombre"),
    ]);

    return res.json({
      total,
      producto,
    });
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    return res.status(500).json({
      msg: "Error al obtener las categorías",
    });
  }
};

module.exports.obtenerProducto = async (req = request, res = response) => {
  const id = req.params.id;

  const categoria = await Producto.findById(id)
    .populate("usuario", "nombre")
    .populate("categoria", "nombre");

  res.json(categoria);
};

module.exports.crearProducto = async (req, res = response) => {
  const { estado, usuario, ...body } = req.body;

  const productoDB = await Producto.findOne({ nombre:body.nombre });

  if (productoDB) {
    return res.status(400).json({
      msg: `El producto ${productoDB.nombre}, ya existe`,
    });
  }

  //datos
  const data = {
    ...body,
    nombre: body.nombre.toUpperCase(),
    usuario: req.usuario._id,
  };

  const producto = new Producto(data);
  await producto.save();
  res.status(201).json(producto);
};

module.exports.actualizarProducto = async (req, res) => {
  const { id } = req.params;
  const { estado, usuario, ...body } = req.body;

  if (body.nombre) {
    body.nombre = body.nombre.toUpperCase();
  }

  body.usuario = req.usuario._id;

  const productoActualizado = await Producto.findByIdAndUpdate(id, body ,{ new:true });

  return res.json(productoActualizado);
};

module.exports.eliminarProducto = async (req, res) => {
  const { id } = req.params;

  const productoEliminado = await Producto.findByIdAndUpdate(id, {
    estado: false,
  });

  return res.json(productoEliminado);
};
