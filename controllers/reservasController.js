const { response, request } = require("express");
const {Restaurante,Reserva,Reservacion} = require('../models');

const {validarDireccionRestaurante,validarRestaurante,validarImagRestaurante} = require('../helpers/validarRestaurante');
const { findByIdAndUpdate } = require("../models/restauranteModel");
const {isValidObjectId}=require('mongoose')
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

const reservasPost = async(req=request,res=response)=>{
    try {
        const {
            nombreReserva,
            mesa,
            fecha,
            idRestaurante
        } = req.body


        
        if(!validarRestaurante(idRestaurante)){
            return res.status(400).json({
                msg:`no es valido ese id: ${idRestaurante}`
            })
        }       
        
        if(!nombreReserva||!mesa||!fecha){
            return res.status(400).json({
                msg:'ingrese todos los campos necesarios (nombreReserva,mesa,fecha'
            })
        }


        const limitRestaurante = await Reservacion.find({restaurante:idRestaurante}).populate('reserva')

        let reservaOcupada = false;
        let mesaOcupada =false; 
        console.log(typeof(fecha));
        const fechaa = new Date(fecha);

        // obtener el día de la fecha
        const diaReserva = fechaa.getDate();

    
        const mesReserva = new Date(fecha).getMonth();
        const anoReserva = new Date(fecha).getFullYear();

        

        limitRestaurante.forEach(e=>{
            let dia = new Date(e.reserva.fecha).getDay();
            let mes = new Date(e.reserva.fecha).getMonth();
            let ano = new Date(e.reserva.fecha).getFullYear();
            if(dia==diaReserva&&mes==mesReserva&&ano==anoReserva){
                reservaOcupada=true;
            }
            
        }) 
        
        if(reservaOcupada){
            return res.status(400).json({
                msg:'Ya hay reservacion para esa fecha exacta'
            })
        }

            const data ={
                nombreReserva,
                mesa,
                fecha,
                idRestaurante
            }
            
            const reserva = new Reserva(data);
            
            await reserva.save();
            
            const dataReservacion ={
                restaurante:idRestaurante,
                reserva:reserva._id
            }
            const reservacion = new Reservacion(dataReservacion)
            
            await reservacion.save()

            
           
            
            
            return res.status(201).json(reserva)
            
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg:error
        })
    }
}

const restaurantePut = async(req=request,res=response)=>{
    try {
        
        const {_id} = req.params;

        if(!isValidObjectId(_id)){
            return res.status(400).json({
                msg:`este id: ${_id} no es de mongo`
            })
        }
        const restaurante = await Restaurante.findById(_id)
        
        if(!restaurante){
            return res.status(400).json({
                msg:`Ese id no pertence a ningun restaurante`
            })
        }      

        const {
            nombreRestaurante,
            descripcion,
            direccion,
            ciudad,
        } = req.body

        if(!nombreRestaurante||!descripcion||!direccion||!ciudad){
            return res.status(400).json({
                msg:'ingrese todos los campos necesarios (nombreRestaurante,descripcion,direccion,ciudad'
            })
        }

        if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
            return res.status(400).json({ msg: 'No hay archivos en la peticion.' });          
        }
        const file = req.files.archivo;

        if(await validarDireccionRestaurante(ciudad,direccion)){
            return res.status(401).json({
                msg:`El restaurante con direccion: ${direccion} y en la ciudad: ${ciudad} ya existe`
            });
        }

        const {extension} = await validarImagRestaurante(file)
        if(extension){
            return res.status(401).json({
                msg:`la extension ${extension} no es valida como imagen`
            });
        }

        const nombreArr = restaurante.imgRestaurante.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [publicId]=nombre.split('.');
        console.log(publicId);
        await cloudinary.uploader.destroy(publicId);

        const { tempFilePath } = req.files.archivo
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath)
        

        const data ={
            nombreRestaurante,
            descripcion,
            direccion,
            ciudad,
            imgRestaurante:secure_url
        } 

        await Restaurante.findByIdAndUpdate(_id,data);
        
        return res.status(201).json({
            msg:'Restaurante actualizado con exito'
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg:error
        })
    }
}

const restauranteDelete = async(req=request,res=response)=>{

    try {
        const {_id} = req.params;
        
        if(!isValidObjectId(_id)){
            return res.status(400).json({
                msg:`este id: ${_id} no es de mongo`
            })
        }
        const restaurante = await Restaurante.findByIdAndDelete(_id)
        
        if(!restaurante){
            return res.status(400).json({
                msg:`Ese id no pertence a ningun restaurante`
            })
        }   
    
        await Restaurante.findByIdAndDelete(id);
    
        return res.status(200).json({
            msg:`Restaurante borrado con exito`
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg:error
        })
    }


}

const restauranteById = async(req=request,res=response)=>{


try {
    
    const {_id} = req.params;
    
    if(!isValidObjectId(_id)){
        return res.status(400).json({
            msg:`este id: ${_id} no es de mongo`
        })
    }
    const existe = await Restaurante.findById(_id)
    
    if(!existe){
        return res.status(400).json({
            msg:`Ese id no pertence a ningun restaurante`
        })
    }   

    if(!validarRestaurante(id)){
        return res.status(401).json({
            msg:`El restaurante con id: ${id} no existe en la DB`
        })
    }
    
    const restaurante = await Restaurante.findById(id)
    
    return res.status(200).json(restaurante);
} catch (error) {
    console.log(error);
    return res.status(500).json(error)
    
}


}

const restauranteGet = async(req=request,res=response)=>{
    
    try {

        const restaurantes = await Restaurante.find({});
        
        data = restaurantes.sort((a,b)=>{
            if (a.nombreRestaurante
                > b.nombreRestaurante) {
                return 1;
              }
              if (a.nombreRestaurante < b.nombreRestaurante) {
                return -1;
              }   
              return 0;
        })

        return res.json({data})
        
    } catch (error) {
        console.log(error);
        return res.status(500).json(error)
    }
    
    



}


module.exports = {
    reservasPost
}