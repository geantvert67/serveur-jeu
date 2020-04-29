require('dotenv').config();
const server = require('http').createServer(),
    io = require('socket.io')(server),
    { import_ctrl, player_ctrl } = require('./controllers'),
    ip = process.env.ip || '127.0.0.1',
    port = process.env.port || 8888;

import_ctrl.importConfig();

io.on('connection', socket => {
    const player = player_ctrl.getOrCreate(
        socket.handshake.query.username,
        true
    );

    require('./routes')(io, socket, player);

    socket.on('restartServer', () => {
        import_ctrl.importConfig(socket);
    });

    socket.on('stopServer', () => {
        process.exit();
    });

    socket.on('disconnect', () => {
        if (player) player.isConnected = false;
    });
});

process.on('uncaughtException', err => {
    console.log(err);
});

server.listen(port, ip, () =>
    console.log(`Serveur lancée sur le port ${port}`)
);
