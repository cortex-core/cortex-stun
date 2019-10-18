const stun = require('node-stun');
const redis = require('redis').createClient();

let stun_server = stun.createServer({
    primary: {
        host: '127.0.0.1',
        port: '3478'
    },
    secondary: {
        host: '127.0.0.2',
        port: '3479'
    }
});

stun_server.on('log', function (l) {
    console.log(l);
});

redis.on("error", function (err) {
    console.log(err);
});

stun_server.on('bind', function(event) {
    console.log(event);
    let endpoint = event.addr.addr + ":" + event.addr.port;
    redis.set(event.id+"", endpoint);
});

stun_server.listen();

module.exports = stun_server;