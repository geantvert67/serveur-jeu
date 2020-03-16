const {
    team_ctrl,
    flag_ctrl,
    marker_ctrl,
    player_ctrl,
    config_ctrl
} = require('../controllers');

const { playerVisibilityRadius, playerActionRadius } = config_ctrl.get();

module.exports = (io, socket, player) => {
    socket.on('routine', coordinates => {
        if (player) {
            player.coordinates = coordinates;

            const objects = {};
            objects.players = [
                ...team_ctrl.getTeamPlayers(player.teamId),
                ...player_ctrl.getInRadius(
                    coordinates,
                    player.teamId,
                    playerActionRadius
                )
            ];
            objects.flags = flag_ctrl.getCaptured();
            objects.markers = marker_ctrl.getTeamMarkers(player.teamId);
            objects.unknowns = [
                ...player_ctrl.getInRadius(
                    coordinates,
                    player.teamId,
                    playerVisibilityRadius
                ),
                ...flag_ctrl.getInVisibilityRadius(coordinates)
            ];
            socket.emit('routine', objects);
        }
    });
};
