const Usuario = require('../models/usuarioModel');

const emailExiste= async(correo = '')=>{

    const existeEmail = await Usuario.findOne({correo});
         if(existeEmail){
            throw new Error(`El email ${correo} ya se encuentra registrado`);
        }
}