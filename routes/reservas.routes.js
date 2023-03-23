const{ Router }= require('express');


const {reservasPost,
    reservaPut,
    reservaDelete,
    reservaById,
    reservaGet} = require('../controllers/reservasController');

const router = Router();

router.get('/reservas',reservaGet)

router.get('/reservas/:_id',reservaById)

router.post('/reservas',reservasPost)

router.put('/reservas/:_id',reservaPut)
router.delete('/reservas/:_id',reservaDelete)

module.exports = router;