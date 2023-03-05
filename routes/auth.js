/*
   Rutas auth :localhost:4000/api/auth
 */

const {Router} = require('express');
const {check} = require('express-validator');
const router = Router()
const {validarJWT} = require('../middlewares/validar-jwt');

const {crearUsuario,loginUsuario,revalidarToken} = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

router.post(
    '/new',
    [//middlewares
        check('name','El nombre es obligatorio').not().isEmpty(),
        check('email','El email es obligatorio').isEmail(),
        check('password','El password es obligatorio min de 6 caracteres').isLength({min:6}),
        validarCampos

    ],
     crearUsuario)

router.post(
    '/',
    [//middlewares
    check('email','El email es obligatorio').isEmail(),
    check('password','El password es obligatorio min de 6 caracteres').isLength({min:6}),
    validarCampos
    ], 
    loginUsuario)

router.get('/renew',validarJWT,revalidarToken)

module.exports = router;
