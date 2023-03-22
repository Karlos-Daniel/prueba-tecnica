const { Schema, model } = require('mongoose');

const usuarioSchema = Schema({
    nombre1: {
        type: String,
        required: [true, 'El nombre es obligatorio'],

    },
    apellido1: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    correo: {
        type: String,
        require: [true, 'El correo es obligatorio'],
        unique: true
    },

    password: {
        type: String,
        require: [true, 'La contraseña es obligatoria']
    },
      
});

usuarioSchema.methods.toJSON = function () {
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id
    return usuario;
}


module.exports = model('Usuario', usuarioSchema);

