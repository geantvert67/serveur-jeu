require('dotenv').config();
const server = require('http').createServer(),
    io = require('socket.io')(server),
    { import_ctrl, player_ctrl } = require('./controllers'),
    ip = process.env.ip || '127.0.0.1',
    port = process.env.port || 8888;

import_ctrl.import_config();

io.on('connection', socket => {
    const player = player_ctrl.getOrCreate(
        socket.handshake.query.username,
        true
    );

    require('./routes')(io, socket, player);

    socket.on('disconnect', () => {
        if (player) player.isConnected = false;
    });
});

server.listen(port, ip, () =>
    console.log(`Serveur lancée sur le port ${port}`)
);
