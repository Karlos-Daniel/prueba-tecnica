const {response, request, json} = require('express');
const {Usuario} = require('../models');
const {generarJWT} = require('../helpers/generar-jwt')
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');



const login = async(req= request, res= response)=>{
    
    try {
        const {correo,password} = req.body;

        const errors = validationResult(req);
        
        if(!errors.isEmpty()){
            return res.status(400).json({
                errores: errors.array()
            })
        }

        //Verificar si el email existe
        const usuario = await Usuario.findOne({correo})
            
        if(!usuario){
            return res.status(400).json({
                msg: 'Correo no se encuentra registrado'
            })
        }
        
        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Contraseña incorrecta'
            })
        }
        console.log(usuario._id);
        const token = await generarJWT(usuario._id);
            res.json({
                token
            })
        
    } catch (error) {

        console.log(error);
        return res.status(500).json({
            msg: 'Error al logear'
        });
    }
}

module.exports = {
    login,
}