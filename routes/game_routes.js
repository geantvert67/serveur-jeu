const _ = require('lodash'),
    {
        team_ctrl,
        flag_ctrl,
        marker_ctrl,
        player_ctrl,
        config_ctrl,
        game_ctrl,
        item_ctrl,
        trap_ctrl
    } = require('../controllers');

const {
    playerVisibilityRadius,
    playerActionRadius,
    flagVisibilityRadius,
    flagActionRadius
} = config_ctrl.get();

module.exports = (io, socket, player) => {
    socket.on('getGame', () => {
        socket.emit('getGame', game_ctrl.get());
    });

    socket.on('getInvitations', () => {
        game_ctrl.getInvitations(io);
    });

    socket.on(
        'acceptInvitation',
        ({ gameId, invitationId, accepted, username }) => {
            game_ctrl
                .acceptInvitation(gameId, invitationId, accepted)
                .then(() => {
                    game_ctrl.getInvitations(io);
                    if (accepted) {
                        teamId = team_ctrl.findByMinPlayers().id;
                        if (
                            team_ctrl.addPlayer(
                                teamId,
                                player_ctrl.getOrCreate(username, false)
                            )
                        ) {
                            io.emit('getTeams', team_ctrl.getAll());
                        }
                    }
                })
                .catch(() => {});
        }
    );

    socket.on('publish', () => {
        game_ctrl.publish(socket);
    });

    socket.on('launchGame', date => {
        date ? game_ctrl.launchAt(io, date) : game_ctrl.launch(io);
    });

    socket.on('endGame', () => {
        game_ctrl.end(io);
    });

    socket.on('routine', coordinates => {
        if (player) {
            player.coordinates = coordinates;
            trap_ctrl.routine(player);

            const objects = {},
                playersInActionRadius = player_ctrl.getInRadius(
                    coordinates,
                    player.teamId,
                    playerActionRadius
                ),
                flagInActionRadius = flag_ctrl.getInRadius(
                    coordinates,
                    flagActionRadius
                ),
                itemsInActionRadius = item_ctrl.getInRadius(coordinates, false);

            objects.players = [
                ...team_ctrl.getTeamPlayers(player.teamId),
                ...playersInActionRadius
            ];
            objects.flags = [...flag_ctrl.getCaptured(), ...flagInActionRadius];
            objects.items = itemsInActionRadius;
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
                ),
                ...item_ctrl.getInRadius(
                    coordinates,
                    true,
                    itemsInActionRadius
                ),
                ...trap_ctrl.getInRadius(coordinates)
            ];
            objects.teams = team_ctrl.getAll();
            objects.player = player;

            socket.emit('routine', objects);
        }
    });

    socket.on('adminRoutine', () => {
        const objects = {};

        objects.players = player_ctrl.getAll();
        objects.flags = flag_ctrl.getAll();
        objects.items = item_ctrl.getAll();
        objects.markers = marker_ctrl.getAll();
        objects.teams = team_ctrl.getAll();

        socket.emit('adminRoutine', objects);
    });
};
