const{ Router }= require('express');
const {usuariosPost,usuariosDelete,usuariosPut}=require('../controllers/usuarioController');
const {check} = require('express-validator');

const router = Router();

const error =[check('correo','El correo es obligatorio').not().isEmpty(),
check('correo','El correo es obligatorio').isEmail(),
check('password','La contraseña es obligatorio').not().isEmpty(),]

router.post('/usuario',
error
,usuariosPost);

module.exports = router;