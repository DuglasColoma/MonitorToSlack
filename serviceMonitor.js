class ServiceMonitor{
    constructor(){
    }
    async monitor(services){
        let status = [];
        for (let service of services) {
            let isAlive = await this.ping(service);
            status.push({ service: service.service,
                    alive : isAlive
                });
        }
        return status;
    }
    ping(connection) {
        return new Promise((resolve, reject)=>{
            const tcpp = require('tcp-ping');
            tcpp.ping(connection, ( err, data)=> {
                let error = data.results[0].err;
                resolve(!error);
            });
        });
    }
}
/*
{
    service : "Notification",
    address : "localhost",
    port    : 5003,
    timeout : 1000,
    attempts: 1
}
*/
module.exports = ServiceMonitor;