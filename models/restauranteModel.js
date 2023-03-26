const {Schema, model} = require('mongoose');

const restauranteSchema = Schema({
    nombreRestaurante:{
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    descripcion:{
        type: String,
        require: [true, 'El descripcion es obligatoria']
    },
    direccion: {
        type: String,
        require: [true, 'El direccion es obligatoria']
    },
    ciudad:{
        type: String,
        require: [true, 'El ciudad es obligatoria']
    },
    imgRestaurante: {
        type: String,
        require: [true, 'La imagen es obligatoria']
    },
     

   
}); restauranteSchema.methods.toJSON = function(){
    const { __v, _id,... restaurante }=this.toObject();
    restaurante.uid = _id
    return restaurante;
}

module.exports = model( 'Restaurante',restauranteSchema);