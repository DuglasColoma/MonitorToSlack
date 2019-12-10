const ServiceMonitor = require('../serviceMonitor.js')
//the serviceMonitor throws pings to the ports and if the ip has an open port where it is expected it returns alive
const senderModule = require('../sendToSlack');

class Monitor{
    constructor(){
        this.active         = false;
        this.servicesIps    = {}//Diccionario de ip-puerto para que la busqueda de hasService sea mas rapida
        this.services       = [];
        this.deadServices    = [];
        this.serviceMonitor = new ServiceMonitor();
    }

    isOn(){
        return this.active;
    }

    getAliveServices(){
        return this.services;
    }

    getDeadServices(){
        return this.deadServices;
    }

    hasService(service){
        return Object.keys(this.servicesIps).includes(service.address)&&this.servicesIps[service.address].includes(service.port);
    }

    addService(service){
        if (!Object.keys(this.servicesIps).includes(service.address)){
            this.servicesIps[service.address] = [];
        }
        this.servicesIps[service.address].push(service.port);
        this.services.push(service);
        console.log("Added service "+service.service);
    }

    removeService(service){
        this.servicesIps[service.address] = this.servicesIps[service.address].filter(elem => elem !== service.port);
        this.services = this.services.filter(elem => elem.service != service.service);
        console.log("Removed service "+service.service);
    }

    turnOn(){
        this.active = true;
        this.monitor();
    }

    getAllServices(){
        return {alive : JSON.stringify(this.getAliveServices()),
                dead  : JSON.stringify(this.getDeadServices())};
    }

    turnOff(){
        this.active = false;
    }

    monitor(){
        this.monitorAliveServices();//monitor the services in the alive list
        this.monitorDeadServices();//monitor the services in the dead list
        setInterval( () => {
            if(this.active){
                    this.monitor()}
        }, 5000);//repeats the monitor method each x miliseconds
    }

    informAlive(services){
        for(let service of services){//for each service in the alive list checks if they are still alive otherwise it lets you know that the service died
            if (!service.alive){
                var servicio = this.filter(this.services, service.service);
                this.deadServices.push(servicio);
                this.services = this.services.filter(elem => elem.service != servicio.service);
                console.log("El servicio "+service.service+" ha dejado de funcionar");
                senderModule.send("El servicio "+service.service+" ha dejado de funcionar");
            }
        }
    }

    informDead(services){
        for(let service of services){//for each service in the dead list checks if they are still dead otherwise it lets you know that the service went back to normal
            if (service.alive){
                var servicio = this.filter(this.deadServices, service.service);
                this.deadServices.filter(elem => elem.service != servicio.service);
                this.services.push(servicio);
                console.log("El servicio "+service.service+" ha vuelto a la normalidad");
                senderModule.send("El servicio "+service.service+" ha vuelto a la normalidad");
            }
        }
    }

    filter(services, serviceName){
        var rto;
        for(let service of services){
            if(service.service == serviceName){
                rto = service;
                break;
            }
        }
        return rto;
    }
    
    monitorAliveServices(){
        this.serviceMonitor.monitor(this.services).then(rto => {
            this.informAlive(rto);
        })
    }

    monitorDeadServices(){
        this.serviceMonitor.monitor(this.deadServices).then(rto => {this.informDead(rto)});
    }
}

module.exports = Monitor;