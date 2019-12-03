const ServiceMonitor = require('../serviceMonitor.js')
const senderModule = require('../sendToSlack');

class Monitor{
    constructor(){
        this.workedOnce = false
        this.active = false;
        this.servicesIps = {}//Diccionario de ip-puerto para que la busqueda de hasService sea mas rapida
        this.services = new Set();
        this.deadService = new Set();
        this.serviceMonitor = new ServiceMonitor();
    }

    isOn(){
        return this.active;
    }

    hasService(service){
        return Object.keys(this.servicesIps).includes(service.address)&&this.servicesIps[service.address].includes(service.port);
    }

    addService(service){
        if (!Object.keys(this.servicesIps).includes(service.address)){
            console.log("new")
            this.servicesIps[service.address] = [];
        }
        this.servicesIps[service.address].push(service.port);
        this.services.add(service);
        console.log("Added service "+service.service);
    }

    removeService(service){
        this.servicesIps[service.address] = this.servicesIps[service.address].filter(elem => elem !== service.port);
        this.service.remove(service);
    }

    turnOn(){
        this.active = true;
        this.monitor();
    }
    addAll(rto,services){
        var rta = rto;
        for(s in services){
            rta.add(s);
        }
        console.log(rta)
        return rta;
    }

    getAllServices(){
        var rto = new Set();
        rto = this.addAll(rto,this.services);
        rto = this.addAll(rto,this.deadService);
        console.log(rto)
        console.log(rto)
        return rto;
    }

    turnOff(){
        this.workedOnce = false
        this.active = false;
    }

    monitor(){
        this.monitorAliveServices();
        this.monitorDeadServices();
        setTimeout(()=>{}, 300);
    }

    informAlive(host){
        this.deadService.add(host)
        senderModule.send("El servicio "+host+" ha dejado de funcionar")
    }

    informDead(host){
        this.deadService.remove(host)
        senderModule.send("El servicio "+host+" ha vuelto a la normalidad")
    }
    
    monitorAliveServices(){
        this.serviceMonitor.monitor(this.services).then(rto => {this.informAlive(rto)})
    }

    monitorDeadServices(){
        this.serviceMonitor.monitor(this.services).then(rto => {this.informDead(rto)})
    }
}

module.exports = Monitor;