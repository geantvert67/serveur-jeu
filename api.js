const server = require('http').createServer(),
    io = require('socket.io')(server),
    { import_ctrl, player_ctrl, team_ctrl } = require('./controllers');

import_ctrl.import_config();

io.on('connection', socket => {
    const username = socket.handshake.query.username;
    player_ctrl.create(username);

    socket.on('getTeams', () => {
        socket.emit('getTeams', team_ctrl.getAll());
    });

    socket.on('addTeamPlayer', () => {
        teamId = team_ctrl.findByMinPlayers().id;
        team_ctrl.addPlayer(teamId, username);
        io.emit('getTeams', team_ctrl.getAll());
    });

    socket.on('disconnect', () => {
        player_ctrl.destroy(username);
    });
});

server.listen(8080, () => console.log('Serveur lancée sur le port 8080'));
