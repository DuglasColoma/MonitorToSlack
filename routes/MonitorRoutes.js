const express = require('express');
const router = express.Router();
const system = require('../backend/mockBBDD');

router.get('/service', (req, res, next)=>{
    res.status(200).json(system.getAllServices());
})

router.post('/turnOn', (req, res, next)=>{
    if (!system.isOn()){
        system.turnOn();
        res.status(200).json();
    }
    else{
        res.status(400).json({message: "the monitoring system is already on"});

    }
})
router.post('/turnOff', (req, res, next)=>{
    if (system.isOn()){
        system.turnOff();
        res.status(200).json(); 
    }
    else{
        res.status(400).json({message: "The monitoring system is already off"});

    }
})

router.put('/service', (req, res, next)=>{
    var service     = req.body.service  != undefined;
    var address     = req.body.address  != undefined;
    var port        = req.body.port     != undefined;
    var timeout     = req.body.timeout  != undefined;
    var attempts    = req.body.attempts != undefined;
    if (service&&address&&port&&timeout&&attempts){
        if (system.hasService(req.body)){
            res.status(400).json({message: "The service is already under monitoring"});
        }
        else{
            system.addService(req.body);
            res.status(200).json({});
        }
    }
    else{
        res.status(400).json({message:"BAD_REQUEST"});
    }
    
})

router.delete('/service', (req, res, next)=>{
    var service     = req.body.service  != undefined;
    if (service){
        if (system.hasService(req.body)){
            system.removeService(req.body);
            res.status(200).json({});
        }
        else{
            res.status(404).json({message: "RELATED_RESOURCE_NOT_FOUND"});
        }
    }
    else{
        res.status(400).json({message:"BAD_REQUEST"});
    }
})

module.exports = router;