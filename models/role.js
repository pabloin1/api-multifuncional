const { Schema, model } = require('mongoose');

const RoleSchema = Schema({
    rol: {
        type: String,
        required: [true, 'El rol es obligatorio']
    }
});


RoleSchema.methods.toJSON = function() {
    const { __v, _id, rol } = this.toObject();
    return rol;
}


module.exports = model( 'Role', RoleSchema );
