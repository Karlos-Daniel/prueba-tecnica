const{ Router }= require('express');
const {validarJWT} = require('../middlewares/validar-jwt')
const {body,check} = require('express-validator');
const {restaurantePost,
    restaurantePut,
    restauranteDelete,
    restauranteById,
    restauranteGet} = require('../controllers/restauranteController');

const router = Router();

const camposVacios = [
    validarJWT,
    body('nombreRestaurante','Este campo esta vacio').not().isEmpty(),
    body('descripcion','Este campo esta vacio').not().isEmpty(),
    body('direccion','Este campo esta vacio').not().isEmpty(),
    body('ciudad','Este campo esta vacio').not().isEmpty()
]

const validarTipos =  [
    body('nombreRestaurante','Este campo debe ser un string').isString(),
    body('descripcion','Este campo debe ser un string').isString(),
    body('direccion','Este campo debe ser un string').isString(),
    body('ciudad','Este campo debe ser un string').isString(),
]

const errores = camposVacios.concat(validarTipos)


router.get('/restaurantes',[validarJWT],restauranteGet)

router.get('/restaurante/:_id',[validarJWT],restauranteById)

router.post('/restaurante',errores,restaurantePost)

router.put('/restaurante/:_id',errores,restaurantePut)

router.delete('/restaurante/:_id',[validarJWT],restauranteDelete)

module.exports = router;