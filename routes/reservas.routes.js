const{ Router }= require('express');


const {reservasPost} = require('../controllers/reservasController');

const router = Router();

//router.get('/restaurantes',restauranteGet)

//router.get('/restaurante/:id',restauranteById)

router.post('/reservas',reservasPost)

//router.put('/restaurante/:_id',restaurantePut)

//router.delete('/restaurante/:id',restauranteDelete)

module.exports = router;