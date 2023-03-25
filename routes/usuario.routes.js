const{ Router }= require('express');
const {validarJWT} = require('../middlewares/validar-jwt')
const {usuariosPost,usuariosDelete,usuariosPut}=require('../controllers/usuarioController');
const {check} = require('express-validator');

const router = Router();

const error =[check('correo','El correo es obligatorio').not().isEmpty(),
check('correo',`'El correo debe ser un email 'ejemplo@ejemplo.com' `).isEmail(),
check('password','La contraseña es obligatorio').not().isEmpty(),]

router.post(
    '/usuario',error,
    usuariosPost);
    
router.put('/usuario/:_id',error,usuariosPut);

router.delete('/usuario/:_id',usuariosPut);



module.exports = router;