const{ Router }= require('express');
const {validarJWT} = require('../middlewares/validar-jwt')
const {usuariosPost,usuariosDelete,usuariosPut}=require('../controllers/usuarioController');
const {check: body} = require('express-validator');

const router = Router();

const error =[
body('nombre1','El correo es obligatorio').not().isEmpty(),
body('nombre1','El nombre debe ser un String').isString(),
body('apellido1','El apellido1 es obligatorio').not().isEmpty(),
body('apellido1','El Apellido debe ser un String').isString(),
body('correo','El correo es obligatorio').not().isEmpty(),
body('correo',`'El correo debe ser un email 'ejemplo@ejemplo.com' `).isEmail(),
body('password','La contraseña es obligatorio').not().isEmpty(),]

router.post(
    '/usuario',error,
    usuariosPost);
    
router.put('/usuario/:_id',error,usuariosPut);

router.delete('/usuario/:_id',usuariosDelete);



module.exports = router;