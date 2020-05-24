const { team_ctrl } = require('../controllers');

module.exports = (io, socket, player) => {
    /**
     * Récupère les équipes
     */
    socket.on('getTeams', () => {
        socket.emit('getTeams', team_ctrl.getAll());
    });

    /**
     * Ajoute le joueur dans l'équipe ayant le moins de joueur
     */
    socket.on('addTeamPlayer', () => {
        teamId = team_ctrl.findByMinPlayers().id;
        if (team_ctrl.addPlayer(teamId, player)) {
            io.emit('getTeams', team_ctrl.getAll());
        }
    });
};
