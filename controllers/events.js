const {response} = require('express');
const Evento = require('../models/Evento');


const getEvent = async (req,res=response) => {

    const eventos = await Evento.find().populate('user','name')
    return res.json({
        ok:true,
        eventos
    })
}




const createEvent = async (req,res=response) => {

    const evento = new Evento(req.body);
    try {

        evento.user = req.uid;
        const eventoDB = await evento.save();
        return res.status(201).json({
            ok: true,
            eventoDB

        })
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
        
    }


}

const updateEvent = async (req,res=response) => {
    const eventoId = req.params.id;
    const uid = req.uid;
    try {

        const evento = await Evento.findById(eventoId);

        if(!evento){
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            })
        }

        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoUpdate = await Evento.findByIdAndUpdate(eventoId,nuevoEvento,{new:true});

        res.json({
            ok: true,
            eventoUpdate
        })
        

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
        
    }
    
}


const deleteEvent = async (req,res=response) => {
    const eventoId = req.params.id;
    const uid = req.uid;
    try {

        const evento = await Evento.findById(eventoId);

        if(!evento){
            res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            })
        }

        if(evento.user.toString() !== uid){
            res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de eliminar este evento'
            })
        }

    

        await Evento.findByIdAndDelete(eventoId);

        return res.json({
            ok: true,
        })

        
        
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
        
    }
}



module.exports = {
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent

}