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

module.exports = (io, socket, player) => {
    /**
     * Récupère la partie
     */
    socket.on('getGame', () => {
        socket.emit('getGame', game_ctrl.get());
    });

    /**
     * Récupère les invitations
     */
    socket.on('getInvitations', () => {
        game_ctrl.getInvitations(io);
    });

    /**
     * Accepte ou refuse une invitation
     *
     * @param string gameId Identifiant de la partie
     * @param int invitationId Identifiant de l'invitation
     * @param boolean accepted Si l'invitation a été acceptée ou refusée
     * @param int playerId Identifiant du joueur
     * @param string username Nom d'utilisateur du joueur
     */
    socket.on(
        'acceptInvitation',
        ({ gameId, invitationId, accepted, playerId, username }) => {
            if (accepted) {
                const teamId = team_ctrl.findByMinPlayers().id;
                const added = team_ctrl.addPlayer(
                    teamId,
                    player_ctrl.getOrCreate(playerId, username, false)
                );

                if (added) {
                    io.emit('getTeams', team_ctrl.getAll());
                    game_ctrl.acceptInvitation(
                        gameId,
                        invitationId,
                        accepted,
                        socket
                    );
                } else {
                    socket.emit('onError', 'Toutes les équipes sont pleines');
                }
            } else {
                game_ctrl.acceptInvitation(
                    gameId,
                    invitationId,
                    accepted,
                    socket
                );
            }
        }
    );

    /**
     * Rend la partie publique
     */
    socket.on('publish', () => {
        game_ctrl.publish(socket);
    });

    /**
     * Lance la partie à une certaine date
     *
     * @param date date Date de lancement
     */
    socket.on('launchGame', date => {
        date ? game_ctrl.launchAt(io, date) : game_ctrl.launch(io);
    });

    /**
     * Termine la partie
     */
    socket.on('endGame', () => {
        game_ctrl.end(io);
    });

    /**
     * Routine des joueurs : ils envoient leur position et récupèrent tous les
     * objets nécessaires
     */
    socket.on('routine', coordinates => {
        const {
            playerVisibilityRadius,
            playerActionRadius,
            flagVisibilityRadius,
            flagActionRadius
        } = config_ctrl.get();

        if (player) {
            player.coordinates = coordinates;
            trap_ctrl.routine(player);

            const objects = {},
                playersInActionRadius = player_ctrl.getInRadius(
                    coordinates,
                    player.teamId,
                    playerActionRadius
                ),
                flagInActionRadius = [
                    ...flag_ctrl.getFromPlayer(player),
                    ...flag_ctrl.getInRadius(coordinates, flagActionRadius)
                ],
                itemsInActionRadius = item_ctrl.getInRadius(coordinates, false);

            objects.players = [
                ...team_ctrl.getTeamPlayers(player.teamId),
                ...playersInActionRadius
            ];
            objects.flags = _.uniqBy(
                [...flag_ctrl.getCaptured(), ...flagInActionRadius],
                'id'
            );
            objects.items = itemsInActionRadius;
            objects.markers = marker_ctrl.getTeamMarkers(player.teamId);
            objects.unknowns = [
                ...player_ctrl.getInRadius(
                    coordinates,
                    player.teamId,
                    playerVisibilityRadius,
                    playersInActionRadius,
                    player.visibilityChange
                ),
                ...flag_ctrl.getInRadius(
                    coordinates,
                    flagVisibilityRadius,
                    flagInActionRadius,
                    player.visibilityChange
                ),
                ...item_ctrl.getInRadius(
                    coordinates,
                    true,
                    itemsInActionRadius,
                    player.visibilityChange
                ),
                ...trap_ctrl.getInRadius(coordinates)
            ];
            objects.teams = team_ctrl.getAll();
            objects.player = player;

            socket.emit('routine', objects);
        }
    });

    /**
     * Routine du maitre de jeu : il récupère tous les objets existants
     */
    socket.on('adminRoutine', () => {
        const objects = {};

        objects.players = player_ctrl.getAll();
        objects.flags = flag_ctrl.getAll();
        objects.items = item_ctrl.getAll();
        objects.traps = trap_ctrl.getAll();
        objects.markers = marker_ctrl.getAll();
        objects.teams = team_ctrl.getAll();

        socket.emit('adminRoutine', objects);
    });
};
