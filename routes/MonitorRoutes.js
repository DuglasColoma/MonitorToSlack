const express = require('express');
const router = express.Router();
const system = require('../backend/mockBBDD')

router.get('/turnOn', (req, res, next)=>{
    if (!system.isOn()){
        system.turnOn()
        res.status(200).json();
    }
    else{
        res.status(400).json({message: "the monitoring system is already on"})

    }
})
router.get('/turnOff', (req, res, next)=>{
    if (system.isOn()){
        system.turnOff()
        res.status(200).json(); 
    }
    else{
        res.status(400).json({message: "the monitoring system is already off"})

    }
})

module.exports = router;