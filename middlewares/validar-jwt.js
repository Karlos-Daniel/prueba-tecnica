const { response } = require('express');
const jwt = require('jsonwebtoken');

const {Usuario} = require('../models'); 

const validarJWT = async(req, res=response, next)=>{
    
    try {
        const token = await req.header('token');


    
        if(!token){
            return res.status(401).json({
                msg: "No hay token en la peticion"
            }); 
        }
        const decode = jwt.decode(token)
       
        if (decode===null) {
            return res.status(400).json({
                msg:'Token invalido'
            })
        }

        const tokenValidado = jwt.verify(token,process.env.SECRET_KEY,(err, decoded)=>{
            if (err) {
                return res.status(401).json({
                    msg:'token modificado'
                });
            }});
        console.log(tokenValidado);
        const usuarioAuth= await Usuario.findById(tokenValidado.uid);

        if(!usuarioAuth){
            res.status(401).json({
                msg: "Usuario no existe en la DB"
            }); 
        }

        req.usuarioAuth = usuarioAuth;

        req.uid = tokenValidado;

        next();   
        
    } catch (error) {
        console.log(error);
    }
   
}

module.exports = {
    validarJWT
}