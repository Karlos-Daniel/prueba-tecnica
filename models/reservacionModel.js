const {Schema, model} = require('mongoose');

const reservacionSchema = Schema({
    
    restarante:{
        type: Schema.Types.ObjectId,
        ref: 'Restaurante',
        require: true
    },
    reserva:{
        type: Schema.Types.ObjectId,
        ref: 'Reserva',
        require: true
    },
      
}); reservacionSchema.methods.toJSON = function(){
    const { __v, _id,... reservacion }=this.toObject();
    reservacion.uid = _id
    return reservacion;
}

module.exports = model('Reservacion',reservacionSchema);