const {Router} = require('express')
const {validarJWT} = require('../middlewares/validar-jwt')
const {getEvent,createEvent,updateEvent,deleteEvent} = require('../controllers/events')
const {check} = require('express-validator');
const {validarCampos}= require('../middlewares/validar-campos')
const {isDate} = require('../helpers/isDate')

const router = Router()

//Obtener eventos
router.get(
    '/',
    validarJWT,
    getEvent);


//create a new event
router.post(
    '/',
    [
        check('title','El titulo es obligatorio').not().isEmpty(),
        check('start','Fecha de inicio es obligatoria').custom(isDate),
        check('end','Fecha de inicio es obligatoria').custom(isDate),
        validarCampos
    ],
    validarJWT,
    createEvent);


//update event
router.put(
    '/:id',
    validarJWT,
    updateEvent);


//delete event
router.delete(
    '/:id',
    validarJWT,
    deleteEvent);


module.exports = router;