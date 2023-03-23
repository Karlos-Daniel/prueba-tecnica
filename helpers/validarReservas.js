
const {Reserva} = require('../models/reservasModel')

const validarReserva = async(id)=>{

    if(!isValidObjectId(id)){
        return false
    }
    
    const reserva = await Reserva.findById(id)
    
    if(!reserva){
        return false
    }

    return true
}

module.exports = {
    validarReserva, 
}