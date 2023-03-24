const{ Router }= require('express');
const {login}=require('../controllers/loginController');
const {body,check} = require('express-validator');

const router = Router();

router.post('/login'

,[
    body('correo','esta vacio este campo').not().isEmpty(),
    body('correo','no es un email valido').isEmail(),
    body('password','esta vacio este campo').not().isEmpty()
],

login);

module.exports = router;