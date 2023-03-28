const { response, request } = require("express");
const { Reserva } = require('../models');
const {validationResult} = require('express-validator');
const moment = require('moment')

const {validarRestaurante} = require('../helpers/validarRestaurante');

const {validarReserva} = require('../helpers/validarReservas')

const reservasPost = async (req = request, res = response) => {
    try {
        const {
            nombreReserva,
            mesa,
            fecha,
            restaurante
        } = req.body

        const errors = validationResult(req);
        
        if(!errors.isEmpty()){
            return res.status(400).json({
                errores: errors.array()
            })
        }      
        
        const validarFecha = new Date(fecha);
        if(validarFecha=='Invalid Date'){
            return res.status(400).json({
                errores:[{msg: 'no es una fecha valida'}]
            })
        }
        
        
        if (!validarRestaurante(restaurante)) {
            return res.status(400).json({errores:

               [{
                msg: `no es valido ese id: ${restaurante}`
            }]})
        }
    
        
        const mesasValidas = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
        if(!mesasValidas.includes(mesa)){
            return res.status(400).json({errores:
                [{msg:'no es una mesa valida'}]
            })
        }

        const dateMoment = new Date(fecha)
        const fechaMoment = moment(dateMoment).format('MM/DD/YYYY');    

        const reservasRestaurante = await Reserva.find({ restaurante,fecha:fechaMoment})
       
        if(reservasRestaurante.length>=15){
            return res.status(400).json({erores:
                [{msg:'Ya hay 15 mesas para ese restaurante'}]
            })
        }

        const mesasRestaurantesFecha = await Reserva.find({ restaurante,fecha:fechaMoment,mesa})

        if(mesasRestaurantesFecha.length>0){
            return res.status(400).json({errores:
                [{msg:'ya existe una reserva en esa mesa para esa fecha'}]
            })
        }

        const reservasFechas = await Reserva.find({fecha:fechaMoment})
        if(reservasFechas.length>=20){
            return res.status(400).json({errores:
                [{msg:'ya hay 20 mesas reservadas entre todos los restaurantes para esa fecha'}]
            })
        }
       
        const data = {
            nombreReserva,
            mesa,
           fecha:fechaMoment,
            restaurante
        }

        const reserva = await Reserva(data)

        await reserva.save()

        return res.status(201).json({
            msg:'Reserva creada con exito'
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: error
        })
    }
}

const reservaPut = async (req = request, res = response) => {
    try {

        const { _id } = req.params;

        const errors = validationResult(req);
        
        if(!errors.isEmpty()){
            return res.status(400).json({
                errores: errors.array()
            })
        }

        if(!validarReserva(_id)){
            return res.status(400).json({errores:[{
                msg:`no es valido ese id: ${_id}`
            }]})
        }  

        const {
            nombreReserva,
            mesa,
            fecha,
            restaurante
        } = req.body

        
        
        
       
        const validarFecha = new Date(fecha);
        if(validarFecha=='Invalid Date'){
            return res.status(400).json({errores:[{
                msg: 'no es una fecha valida'
            }]})
        }
        
       
        if (!await validarRestaurante(restaurante)) {
            return res.status(400).json({errores:[{
                msg: `no es valido ese id: ${restaurante}`
            }]})
        }
        
        //Posible Middleware
        const mesasValidas = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
        if(!mesasValidas.includes(mesa)){
            return res.status(400).json({errores:[{
                msg:'no es una mesa valida'
            }]})
        }

        const dateMoment = new Date(fecha)
        const fechaMoment = moment(dateMoment).format('MM/DD/YYYY');    

        const reservasRestaurante = await Reserva.find({ restaurante,fecha:fechaMoment})
       
        if(reservasRestaurante.length>=15){
            return res.status(400).json({errores:[{
                msg:'Ya hay 15 mesas para ese restaurante'
            }]})
        }

        const mesasRestaurantesFecha = await Reserva.find({ restaurante,fecha:fechaMoment,mesa})

        if(mesasRestaurantesFecha.length>0){
            return res.status(400).json({errores:[{
                msg:'ya existe una reserva en esa mesa para esa fecha'
            }]})
        }

        const reservasFechas = await Reserva.find({fecha:fechaMoment})
        if(reservasFechas.length>=20){
            return res.status(400).json({errores:[{
                msg:'ya hay 20 mesas reservadas entre todos los restaurantes para esa fecha'
            }]})
        }
       
        const data = {
            nombreReserva,
            mesa,
           fecha:fechaMoment,
            restaurante
        }

       await Reserva.findByIdAndUpdate(_id,data)

        return res.status(201).json({
            msg:'Reserva modificada con exito'
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: error
        })
    }
}

const reservaDelete = async (req = request, res = response) => {

    try {
        const { _id } = req.params;

        const errors = validationResult(req);
        
        if(!errors.isEmpty()){
            return res.status(400).json({
                errores: errors.array()
            })
        }

        if(!validarReserva(_id)){
            return res.status(400).json({errores:[{
                msg:`no es valido ese id: ${_id}`
            }]})
        } 

        await Reserva.findByIdAndDelete(_id);

        return res.status(200).json({
            msg: `Reserva borrada con exito`
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: error
        })
    }


}

const reservaById = async (req = request, res = response) => {


    try {

        const { _id } = req.params;
        
        const errors = validationResult(req);
        
        if(!errors.isEmpty()){
            return res.status(400).json({
                errores: errors.array()
            })
        }

        if(!await validarReserva(_id)){
            return res.status(400).json({errores:[{
                msg:`no es valido ese id: ${_id}`
            }]})
        } 

        const reserva = await Reserva.findById(_id).populate('restaurante','nombreRestaurante')

        return res.status(200).json(reserva);


    } catch (error) {
        console.log(error);
        return res.status(500).json(error)

    }


}

const reservaGet = async (req = request, res = response) => {

    try {

        const errors = validationResult(req);
        
        if(!errors.isEmpty()){
            return res.status(400).json({
                errores: errors.array()
            })
        }

        const reservas = await Reserva.find({}).populate('restaurante','nombreRestaurante');

        return res.json(reservas)

    } catch (error) {

        console.log(error);
        return res.status(500).json(error)

    }

}


module.exports = {
    reservasPost,
    reservaPut,
    reservaDelete,
    reservaById,
    reservaGet
}