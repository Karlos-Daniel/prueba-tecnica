const { response, request } = require("express");
const {Restaurante,Reserva} = require('../models');

const {validarDireccionRestaurante,validarRestaurante,validarImagRestaurante} = require('../helpers/validarRestaurante');
const { findByIdAndUpdate } = require("../models/restauranteModel");
const {isValidObjectId}=require('mongoose')
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

const restaurantePost = async(req=request,res=response)=>{
    try {
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
        
        const data ={
            nombreRestaurante,
            descripcion,
            direccion,
            ciudad,
        }
        const restaurante = new Restaurante(data);

        await restaurante.save();

        const { tempFilePath } = file
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath)

        restaurante.imgRestaurante = secure_url

        await restaurante.save()

        return res.status(201).json(restaurante)

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

        if(!validarRestaurante(_id)){
            return res.status(400).json({
                msg:`no es valido ese id: ${_id}`
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

        const restaurante = await Restaurante.findById(_id)

        const nombreArr = restaurante.imgRestaurante.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [publicId]=nombre.split('.');
        await cloudinary.uploader.destroy(publicId);

        const { tempFilePath } = file
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
        
        if(!validarRestaurante(_id)){
            return res.status(400).json({
                msg:`no es valido ese id: ${_id}`
            })
        }
        
        const reservas = await Reserva.find({restaurante:_id})
        
        if(reservas.length>0){
             return res.status(400).json({
                msg:'Este restaurante tiene reservas, porfavor elimine las reservas para eliminar el restaurante'
             })
        }

        const restaurante = await Restaurante.findById(_id)
        

        const nombreArr = restaurante.imgRestaurante.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [publicId]=nombre.split('.');
        console.log(publicId);
        await cloudinary.uploader.destroy(publicId);
    
        await Restaurante.findByIdAndDelete(_id);
    
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
    
    if(!validarRestaurante(_id)){
        return res.status(400).json({
            msg:`no es valido ese id: ${_id}`
        })
    }    

    if(!validarRestaurante(_id)){
        return res.status(401).json({
            msg:`El restaurante con id: ${_id} no existe en la DB`
        })
    }
    
    const restaurante = await Restaurante.findById(_id)
    
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
    restaurantePost,
    restaurantePut,
    restauranteDelete,
    restauranteById,
    restauranteGet
}