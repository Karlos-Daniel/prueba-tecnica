const {Schema, model} = require('mongoose');

const reservaSchema = Schema({
    nombreReserva:{
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    fecha:{
        type: Date,
        require: true
    },
    
     

   
}); restauranteSchema.methods.toJSON = function(){
    const { __v, _id,... restaurante }=this.toObject();
    restaurante.uid = _id
    return restaurante;
}

module.exports = model( 'Restaurante',restauranteSchema);