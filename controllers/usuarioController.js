const{response,request}= require('express');
const Usuario = require('../models/usuarioModel')
const {isValidObjectId}=require('mongoose')
const {validationResult} = require('express-validator');
const brcryptjs = require('bcryptjs');


const usuariosPost = async(req = request, res = response)=>{
    try {
        
      const {nombre1,
            apellido1,
            correo,
            password} = req.body;
            
            const errors = validationResult(req);
        
            if(!errors.isEmpty()){
                return res.status(400).json({
                    errores: errors.array()
                })
            }

            const emailValido = Usuario.find({correo})

            if(emailValido){
                return res.status(400).json({errores:[{
                    msg:'Ya este email se encuentra registrado'
                }]})
            }
            
            const data ={
                nombre1,
                apellido1,          
                correo,
                password
            }
            
            const usuario = new Usuario(data);
            //Encriptar contraseña
            const salt =  brcryptjs.genSaltSync();
            usuario.password = brcryptjs.hashSync(password,salt);
            
        
        //Guardar en DB
        await usuario.save();
        res.json({
            usuario
        });

    } catch (error) {
        console.log(error);
        res.status(500);
    }
 }
 const usuariosPut = async(req = request, res = response)=>{
    try {
        
        const {_id} = req.params;

        const errors = validationResult(req);
        
        if(!errors.isEmpty()){
            return res.status(400).json({
                errores: errors.array()
            })
        }

        if(!isValidObjectId(_id)){
            return res.status(400).json({errores:[{
                msg:`este id: ${_id} no es de mongo`
            }]})
        }
        const existe = await Usuario.findById(_id)
        
        if(!existe){
            return res.status(400).json({errores:[{
                msg:`Ese id no pertence a ningun usuario`
            }]})
        } 
        
        const {
            nombre1,
            apellido1,
            correo,
            password} = req.body

            const data ={
                nombre1,          
                apellido1,
                correo,
                password
            }
            
       
            //Encriptar contraseña
             const salt =  brcryptjs.genSaltSync();
             data.password = brcryptjs.hashSync(password,salt);
             await Usuario.findByIdAndUpdate(id, data);
            
        return res.json({
            msg: 'Ha sido cambiado con exito',
            data
        })

    } catch (error) {
        console.log(error);
        res.status(500);
    }
 }

 const usuariosDelete = async(req = request, res = response)=>{
try {
    
    const {_id}= req.params;

    const errors = validationResult(req);
        
        if(!errors.isEmpty()){
            return res.status(400).json({
                errores: errors.array()
            })
        }
    
    if(!isValidObjectId(_id)){
        return res.status(400).json({errores:[{
            msg:`este id: ${_id} no es de mongo`
        }]})
    }
    const existe = await Usuario.findById(_id)
    
    if(!existe){
        return res.status(400).json({errores:[{
            msg:`Ese id no pertence a ningun usuario`
        }]})
    } 
    //Convertimos el estado del usuario en false
    const usuario = await Usuario.findByIdAndDelete(id);


  return res.json({
        msg: 'usuario borrado con exito'
   })

} catch (error) {
    console.log(error);
        res.status(500);
}
}

module.exports = {
    usuariosPut,
    usuariosDelete,
    usuariosPost
}