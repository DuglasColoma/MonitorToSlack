class ServiceMonitor{
    constructor(){
    }
    async monitor(services){
        let status = {
        }
        for (let service of services) {
            let isAlive = await this.ping(service);
            status[service.service] = isAlive;
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

function test() {
    let services = [
        {
            service : "Logging",
            address : "localhost",
            port    : 5002,
            timeout : 1000,
            attempts: 1
        },
        {
            service : "UNQfy",
            address : "localhost",
            port    : 5000,
            timeout : 1000,
            attempts: 1
        },
        {
            service : "Notification",
            address : "localhost",
            port    : 5003,
            timeout : 1000,
            attempts: 1
        }
    ],
    status = new ServiceMonitor().monitor(services);
    status.then(rto => {console.log(rto)});
}
test();

module.exports = ServiceMonitor;