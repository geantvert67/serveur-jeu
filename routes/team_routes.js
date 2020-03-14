const { team_ctrl } = require('../controllers');

module.exports = (io, socket, player) => {
    socket.on('getTeams', () => {
        socket.emit('getTeams', team_ctrl.getAll());
    });

    socket.on('addTeamPlayer', () => {
        teamId = team_ctrl.findByMinPlayers().id;
        if (team_ctrl.addPlayer(teamId, player)) {
            io.emit('getTeams', team_ctrl.getAll());
        }
    });
};
