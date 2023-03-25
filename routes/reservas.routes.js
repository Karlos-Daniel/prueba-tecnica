const{ Router }= require('express');

const {body,check} = require('express-validator');



const {validarJWT} = require('../middlewares/validar-jwt');

const {reservasPost,
    reservaPut,
    reservaDelete,
    reservaById,
    reservaGet} = require('../controllers/reservasController');


const router = Router();

const camposVacios = [
    validarJWT,
    body('nombreReserva','Este campo esta vacio').not().isEmpty(),
    body('mesa','Este campo esta vacio').not().isEmpty(),
    body('fecha','Este campo esta vacio').not().isEmpty(),
    body('restaurante','Este campo esta vacio').not().isEmpty()
]

const validarTipos =  [
    body('nombreReserva','Este campo debe ser un string').isString(),
    body('mesa','Este campo debe ser un numero').isNumeric(),
    body('restaurante','Este campo debe ser un mongoID valido').isMongoId()
]

const errores = camposVacios.concat(validarTipos)


router.get('/reservas',[validarJWT],reservaGet)

router.get('/reserva/:_id',[validarJWT],reservaById)

router.post('/reservas', errores ,reservasPost)

router.put('/reservas/:_id',errores,reservaPut)

router.delete('/reservas/:_id',[validarJWT],reservaDelete)

module.exports = router;