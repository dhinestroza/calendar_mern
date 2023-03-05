const {response} = require('express');
const bcrypt = require('bcryptjs')
const Usuario = require('../models/usuario');
const {generarJWT} = require('../helpers/jwt');

const crearUsuario = async (req , res =response) => {
    const {name,email,password} = req.body;
    try {
        let usuario = await Usuario.findOne({email});
        console.log(usuario);
        if(usuario){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe con ese email'
            })
        }
        usuario = new Usuario(req.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password,salt);

        //Guardar usuario
        await usuario.save()

        //Generar el JWT
        const token = await generarJWT(usuario.id,usuario.name);
     
        res.status(201).json({
        ok: true,
        msg: 'registro',
        uid: usuario.id,
        name: usuario.name,
        token:token
       
        })
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
        
    }
    
}





const loginUsuario = async (req , res =response) => {
    const {email,password} = req.body;

    try {
        let usuario = await Usuario.findOne({email});
        if(!usuario){
            return res.status(400).json({
                ok:false,
                msg: 'El usuario no existe con ese email'
            })
            
        }

        //Confirmar los passwords
        const validPassword = bcrypt.compareSync(password,usuario.password);

        if(!validPassword){//si no es valido
            return res.status(400).json({
                ok:false,
                msg: 'Password incorrecto'
            })
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id,usuario.name);

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token:token
        })

        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
        
    }

    res.status(201).json({
        ok: true,
        msg: 'login',
        email,
        password
    })
}




const revalidarToken = async (req , res =response) => {

    const uid = req.uid;
    const name = req.name;

    //generar token

    const token = await generarJWT(uid,name);

    res.json({
        ok: true,
        token
    })
}



module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}