const ServiceMonitor = require('../serviceMonitor.js')
const senderModule = require('../sendToSlack')

class Monitor{
    constructor(){
        this.active = false;
        this.services = new Set()
        this.deadService = new Set()
        this.serviceMonitor = new ServiceMonitor()
    }

    isOn(){
        return this.active
    }

    addService(service){
        this.services.add(service);
        console.log("Added service "+service)
    }

    removeService(service){
        this.service.remove(service);
    }

    turnOn(){
        this.active = true;
        this.monitor();
    }

    turnOff(){
        this.active = false;
    }

    monitor(){
        while (this.isOn()) {
            this.monitorAliveServices();
            this.monitorDeadServices();
            await sleep(300);
        }
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
        this.serviceMonitor.monitor(this.services).then(rto => {informAlive(rto)})
    }

    monitorDeadServices(){
        this.serviceMonitor.monitor(this.services).then(rto => {informDead(rto)})
    }
}

module.exports = Monitor;