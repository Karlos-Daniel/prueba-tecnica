const {Schema, model} = require('mongoose');

const restauranteSchema = Schema({
    nombreRestaurante:{
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    Descripcion:{
        type: String,
        require: true
    },
    Direccion: {
        type: String,
        require: true
    },
    Ciudad:{
        type: String,
        require: true
    },
    imgProducto: {
        type: String,
    },
     

   
}); restauranteSchema.methods.toJSON = function(){
    const { __v, _id,... restaurante }=this.toObject();
    restaurante.uid = _id
    return restaurante;
}

module.exports = model( 'Restaurante',restauranteSchema);