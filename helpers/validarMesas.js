
const {Reserva} = require('../models/reservasModel')

const validarRestaurante = async(id)=>{

    if(!isValidObjectId(id)){
        return false
    }
    
    const restaurante = await Restaurante.findById(id)
    
    if(!restaurante){
        return false
    }

    return true
}

module.exports = {
    validarDireccionRestaurante,
    validarRestaurante,
    validarImagRestaurante
}