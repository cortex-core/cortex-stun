const stun = require('node-stun');

describe('cortex-stun simple tests', function() {

    let client;
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
    });

    it('should support stun requests and update client-endpoint bindings in redis', done => {
        if (client) {
            client.start(function (result) {
                if (result != 0) {
                    return;
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

                // TODO : Validate if bindings appear in redis
                done();
            });
        }
    });
});