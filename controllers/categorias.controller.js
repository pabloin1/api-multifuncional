const { response, request } = require("express");
const { Categoria } = require("../models");

module.exports.obtenerCategorias = async (req, res = response) => {
    try {
        const { limite = 5, desde = 0 } = req.query;
        const query = { estado: true };


        const [total, categoria] = await Promise.all([
            Categoria.countDocuments(query),
            Categoria.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
                .populate("usuario","nombre correo")
        ]);

        return res.json({
            total,
            categoria
        });
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        return res.status(500).json({
            msg: 'Error al obtener las categorías'
        });
    }
};

module.exports.obtenerCategoria = async(req = request,res= response)=>{
    const id = req.params.id;

    const categoria = await Categoria.findById(id).populate('usuario','nombre')

    res.json(categoria)
}

module.exports.actualizarCategoria = async(req,res)=>{
    const nombre = req.body.nombre.toUpperCase();
    const {id} = req.params;

    const categoriaDB = await Categoria.findOne({nombre})

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        })
    }   
    
    
    const categoriaActualizada = await Categoria.findByIdAndUpdate(id,{nombre})

    return res.json(categoriaActualizada)

}

module.exports.EliminarCategoria = async(req,res)=>{
    const {id} = req.params;

    const categoriaEliminada = await Categoria.findByIdAndUpdate(id,{estado:false})

    return res.json(categoriaEliminada)

}




module.exports.crearCategoria = async(req,res = response) =>{

    const nombre = req.body.nombre.toUpperCase()

    const categoriaDB = await Categoria.findOne({nombre})

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        })
    }

    //datos
    const data ={
        nombre,
        usuario:req.usuario._id,
    }

    const categoria = new Categoria(data)
    await categoria.save()

    res.status(201).json(categoria)
}