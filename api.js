const server = require('http').createServer(),
    io = require('socket.io')(server),
    { import_ctrl, player_ctrl } = require('./controllers');

import_ctrl.import_config();

io.on('connection', socket => {
    const username = socket.handshake.query.username;
    player_ctrl.create(username);

    socket.on('disconnect', () => {
        player_ctrl.destroy(username);
    });
});

server.listen(8080, () => console.log('Serveur lancée sur le port 8080'));
