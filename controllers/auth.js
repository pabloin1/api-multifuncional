const { response, request, json } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");

const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {
  const { correo, password } = req.body;

  try {
    // Verificar si el email existe
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - correo",
      });
    }

    // SI el usuario está activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - estado: false",
      });
    }

    // Verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - password",
      });
    }

    // Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

const googleSingIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { correo, nombre, img ,password} = await googleVerify(id_token);

    let usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      //crear
      const data = {
        nombre,
        correo,
        password,
        img,
        google: true,
      };

      usuario = new Usuario(data);

      await usuario.save();
    }

    //si el usuario esta en db
    if (!usuario.estado) {
        return res.status(401).json({
            msg: "hable con el administrador, usuario bloqueado"
        })
       
    }

    //generar jwt
    const token = await generarJWT(usuario.id);

    res.json({
      msg: "todo bien",
      usuario,
      token
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
};

module.exports = {
  login,
  googleSingIn,
};
