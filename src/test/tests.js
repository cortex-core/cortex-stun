const stun = require('node-stun');
const redis = require('redis').createClient();

redis.on("error", function (err) {
    console.log(err);
});

describe('cortex-stun stun protocol IT', function() {

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

describe('cortex-stun redis IT', function() {

    it('should support redis set', done => {
        redis.del('test_key', function (err) {
            if (err != null) {
                throw err;
            }
            redis.set("test_key", "test_value", function (err) {
                if (err != null) {
                    throw err;
                }
                done();
            });
        });
    });

    it('should support redis get', done => {
        redis.set('test_key', 'test_value',  function (err) {
            if (err != null) {
                throw err;
            }
            redis.get("test_key", function (err, res) {
                if (err != null) {
                    throw err;
                }
                if (res !== "test_value") {
                    throw new Error("Failed to match");
                }
                done();
            });
        });
    });
});