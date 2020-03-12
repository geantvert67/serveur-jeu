const server = require('http').createServer(),
    io = require('socket.io')(server),
    {
        import_ctrl,
        team_ctrl,
        config_ctrl,
        area_ctrl
    } = require('./controllers');
require('dotenv').config();

import_ctrl.import_config();

io.on('connection', socket => {
    const username = socket.handshake.query.username;

    socket.on('getTeams', () => {
        socket.emit('getTeams', team_ctrl.getAll());
    });

    socket.on('addTeamPlayer', () => {
        teamId = team_ctrl.findByMinPlayers().id;
        if (team_ctrl.addPlayer(teamId, username)) {
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
        config_ctrl.launch();
        io.emit('getConfig', config_ctrl.get());
    });

    socket.on('routine', coordinates => {
        const player = team_ctrl.getPlayer(username);
        if (player) {
            player.coordinates = coordinates;

            const objects = {};
            objects.players = team_ctrl.getTeamPlayers(player.teamId);
            socket.emit('routine', objects);
        }
    });
});

server.listen(8081, () => console.log('Serveur lancée sur le port 8081'));
