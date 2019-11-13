const stun = require('node-stun');
const redis = require('redis').createClient();

redis.on("error", function (err) {
    console.log(err);
});

describe('cortex-stun stun protocol IT', function() {

    let client;
    let service;
    before(async function () {
        service = require("../main/service");
    });

    beforeEach(async function () {
        client = stun.createClient(Buffer.from("00ea1da4192a2030f"));
        client.setServerAddr("127.0.0.1", 3478);
    });

    after(function () {
        if (client) {
            client.close(function () {
                console.log("All sockets closed.");
            });
        }
        if (service) {
            service.close(function () {
                console.log("Service instance is closed.");
            });
        }
    });

    it('should support stun requests and regB msg', done => {
        if (client) {
            client.start(function (result) {
                if (result != 0) {
                    new Error("Status code is non-zero");
                }
                const mapped = client.getMappedAddr();
                console.log([
                    "Complete(" + result + "): ",
                    (client.isNatted()?"Natted":"Open"),
                    " NB=" + client.getNB(),
                    " EF=" + client.getEF(),
                    " (" + client.getNatType() + ")",
                    " mapped=" + mapped.address + ":" + mapped.port,
                    " rtt=" + client.getRtt()
                ].join(''));
                done();
            });
        }
    });
});