process.env['NODE_CONFIG_DIR'] = './config/';

const stun = require('node-stun');
const redis = require('redis').createClient();
const config = require('config');

let stun_server = stun.createServer(config.get("endpoints"));

stun_server.on('log', function (l) {
    console.log(l);
});

redis.on("error", function (err) {
    console.log(err);
});

stun_server.on('bind', function(event) {
    console.log(event);
    let endpoint = event.addr.addr + ":" + event.addr.port;
    redis.set(event.id + "", endpoint);
});

stun_server.listen();

module.exports = stun_server;