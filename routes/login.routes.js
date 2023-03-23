const{ Router }= require('express');
const {login}=require('../controllers/loginController');
const {body,check} = require('express-validator');

const router = Router();

router.post('/login'

,[
    body('correo').not().isEmpty(),
    body('correo').isEmail(),
    body('password').not().isEmpty()
],

login);

module.exports = router;