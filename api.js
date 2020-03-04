const server = require('http').createServer(),
    io = require('socket.io')(server),
    import_ctrl = require('./controllers/import_ctrl'),
    player_store = require('./stores/player_store'),
    { Player } = require('./models');

import_ctrl.import_config();

io.on('connection', socket => {
    const username = socket.handshake.query.username;
    player_store.add(new Player(username));

    socket.on('disconnect', () => {
        player_store.remove(username);
    });
});

server.listen(8080, () => console.log('Serveur lancée sur le port 8080'));
