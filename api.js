require('dotenv').config();
const server = require('http').createServer(),
    io = require('socket.io')(server),
    {
        import_ctrl,
        team_ctrl,
        config_ctrl,
        area_ctrl,
        player_ctrl
    } = require('./controllers'),
    ip = process.env.ip || '127.0.0.1',
    port = process.env.port || 8888;

import_ctrl.import_config();

io.on('connection', socket => {
    const username = socket.handshake.query.username,
        player = player_ctrl.getOrCreate(username, true);

    socket.on('getTeams', () => {
        socket.emit('getTeams', team_ctrl.getAll());
    });

    socket.on('addTeamPlayer', () => {
        teamId = team_ctrl.findByMinPlayers().id;
        if (team_ctrl.addPlayer(teamId, player)) {
            io.emit('getTeams', team_ctrl.getAll());
        }
    });

    socket.on('getConfig', () => {
        socket.emit('getConfig', config_ctrl.get());
    });

    socket.on('getAreas', () => {
        socket.emit('getAreas', area_ctrl.getAll());
    });

    socket.on('launchGame', () => {
        config_ctrl
            .launch()
            .then(() => io.emit('getConfig', config_ctrl.get()));
    });

    socket.on('routine', coordinates => {
        if (player) {
            player.coordinates = coordinates;

            const objects = {};
            objects.players = team_ctrl.getTeamPlayers(player.teamId);
            socket.emit('routine', objects);
        }
    });

    socket.on('disconnect', () => {
        if (player) player.isConnected = false;
    });
});

server.listen(port, ip, () =>
    console.log(`Serveur lancée sur le port ${port}`)
);
