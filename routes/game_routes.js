const _ = require('lodash'),
    {
        team_ctrl,
        flag_ctrl,
        marker_ctrl,
        player_ctrl,
        config_ctrl
    } = require('../controllers');

const {
    playerVisibilityRadius,
    playerActionRadius,
    flagVisibilityRadius,
    flagActionRadius
} = config_ctrl.get();

module.exports = (io, socket, player) => {
    socket.on('routine', coordinates => {
        if (player) {
            player.coordinates = coordinates;

            const objects = {},
                playersInActionRadius = player_ctrl.getInRadius(
                    coordinates,
                    player.teamId,
                    playerActionRadius
                ),
                flagInActionRadius = flag_ctrl.getInRadius(
                    coordinates,
                    flagActionRadius
                );

            objects.players = [
                ...team_ctrl.getTeamPlayers(player.teamId),
                ...playersInActionRadius
            ];
            objects.flags = [...flag_ctrl.getCaptured(), ...flagInActionRadius];
            objects.markers = marker_ctrl.getTeamMarkers(player.teamId);
            objects.unknowns = [
                ...player_ctrl.getInRadius(
                    coordinates,
                    player.teamId,
                    playerVisibilityRadius,
                    playersInActionRadius
                ),
                ...flag_ctrl.getInRadius(
                    coordinates,
                    flagVisibilityRadius,
                    flagInActionRadius
                )
            ];
            socket.emit('routine', objects);
        }
    });
};
