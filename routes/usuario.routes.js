const{ Router }= require('express');
const {validarJWT} = require('../middlewares/validar-jwt')
const {usuariosPost,usuariosDelete,usuariosPut}=require('../controllers/usuarioController');
const {check} = require('express-validator');

const router = Router();

const error =[check('correo','El correo es obligatorio').not().isEmpty(),
check('correo','El correo es obligatorio').isEmail(),
check('password','La contraseña es obligatorio').not().isEmpty(),]

router.post(
    '/usuario',
    usuariosPost);
    
router.put('/usuario/:_id',usuariosPut);

router.delete('/usuario/:_id',usuariosPut);



module.exports = router;