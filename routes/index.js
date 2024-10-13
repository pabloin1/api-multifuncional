const authRouter = require("../routes/auth");
const buscarRouter = require("../routes/buscar.routes");
const categoriasRouter = require("../routes/categorias.routes");
const productoRouter = require("../routes/productos.routes");
const usuarioRouter = require("../routes/usuarios");
const archivoRouter = require('../routes/uploads.router')

module.exports = [
    {path : '/auth' , router : authRouter},
    {path: '/buscar', router: buscarRouter},
    {path: '/categorias', router: categoriasRouter},
    {path: '/productos', router: productoRouter},
    {path: '/usuarios', router: usuarioRouter},
    {path: '/archivo', router: archivoRouter}
];
