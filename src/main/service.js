const stun = require('node-stun');

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

stun_server.on('bind', function(event) {
    console.log(event);
});

stun_server.listen();

module.exports = stun_server;