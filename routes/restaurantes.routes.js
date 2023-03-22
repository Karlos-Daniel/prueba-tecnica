const{ Router }= require('express');


const {restaurantePost,
    restaurantePut,
    restauranteDelete,
    restauranteById,
    restauranteGet} = require('../controllers/restauranteController');

const router = Router();

router.get('/restaurantes',restauranteGet)

router.get('/restaurante/:id',restauranteById)

router.post('/restaurante',restaurantePost)

router.put('/restaurante/:_id',restaurantePut)

router.delete('/restaurante/:id',restauranteDelete)

module.exports = router;