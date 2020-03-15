const { team_ctrl, flag_ctrl } = require('../controllers');

module.exports = (io, socket, player) => {
    socket.on('routine', coordinates => {
        if (player) {
            player.coordinates = coordinates;

            const objects = {};
            objects.players = team_ctrl.getTeamPlayers(player.teamId);
            objects.flags = flag_ctrl.getCaptured();
            socket.emit('routine', objects);
        }
    });
};
