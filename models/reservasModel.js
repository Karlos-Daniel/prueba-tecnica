const {Schema, model} = require('mongoose');

const reservaSchema = Schema({

    nombreReserva:{
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    mesa:{
        type: Number,
        require: [true, 'La mesa es obligatoria'],
        enum:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
    },
    fecha:{
        type: String,
        require: [true, 'La fecha es obligatoria']
    },
    restaurante:{
        type: Schema.Types.ObjectId,
        ref: 'Restaurante',
        require: true
    }
      
}); 

reservaSchema.methods.toJSON = function(){
    const { __v, _id,... reserva }=this.toObject();
    reserva.uid = _id
    return reserva;
}

module.exports = model('Reserva',reservaSchema);