const {Restaurante} = require('../models');
const {isValidObjectId}=require('mongoose')
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)
const validarDireccionRestaurante = async(ciudad,direccion)=>{

    const existe = await Restaurante.findOne({ciudad,direccion});
    return !!existe;

}

const validarImagRestaurante = async(file,extensiones = ['jpg', 'png', 'jpeg', 'gif'])=>{
    const archivo = file;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];
        
        if (!extensiones.includes(extension)) {
            return extension
        }
        return false
}

const splitAndUpdateImg = async(restaurante,file)=>{
    const nombreArr = restaurante.imgRestaurante.split('/');
    const nombre = nombreArr[nombreArr.length - 1];
    const [publicId]=nombre.split('.');
    await cloudinary.uploader.destroy(publicId);

    const { tempFilePath } = file
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath)
    return secure_url
}

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
    splitAndUpdateImg,
    validarImagRestaurante
}