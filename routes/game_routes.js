const {
    team_ctrl,
    flag_ctrl,
    marker_ctrl,
    player_ctrl
} = require('../controllers');

module.exports = (io, socket, player) => {
    socket.on('routine', coordinates => {
        if (player) {
            player.coordinates = coordinates;

            const objects = {};
            objects.players = team_ctrl.getTeamPlayers(player.teamId);
            objects.flags = flag_ctrl.getCaptured();
            objects.markers = marker_ctrl.getTeamMarkers(player.teamId);
            objects.unknowns = [
                ...player_ctrl.getInVisibilityRadius(
                    coordinates,
                    player.teamId
                ),
                ...flag_ctrl.getInVisibilityRadius(coordinates)
            ];
            socket.emit('routine', objects);
        }
    });
};
