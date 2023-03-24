const jwt = require('jsonwebtoken');

const generarJWT =(_id)=>{
    return new Promise((resolve,reject)=>{

        const payload = {uid: _id};
        
        jwt.sign(payload,process.env.SECRET_KEY,{
            expiresIn: '24h'
        },(err,token)=>{
            if(err){
                console.log(err);
                reject('No se pudo generar el Token');
            }else{
                resolve(token )
            }
        });

    })
}

module.exports={
    generarJWT
}