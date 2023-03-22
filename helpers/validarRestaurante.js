const {Restaurante} = require('../models');

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
        return 'valido'
}

const validarRestaurante = async(id)=>{
    const existe = await Restaurante.findById(id);
    return !!existe
}

module.exports = {
    validarDireccionRestaurante,
    validarRestaurante,
    validarImagRestaurante
}