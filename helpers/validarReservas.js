
const {Reserva} = require('../models')
const { isValidObjectId } = require('mongoose')
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