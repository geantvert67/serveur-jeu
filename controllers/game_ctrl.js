const axios = require('axios'),
    _ = require('lodash'),
    moment = require('moment'),
    { game_store } = require('../stores'),
    player_ctrl = require('./player_ctrl'),
    team_ctrl = require('./team_ctrl'),
    config_ctrl = require('./config_ctrl'),
    interval_ctrl = require('./interval_ctrl');

const _this = (module.exports = {
    /**
     * Renvoie la partie
     */
    get: () => {
        return game_store.get();
    },

    /**
     * Renvoie les invitations
     *
     * @param object socket Objet Socket.io
     */
    getInvitations: socket => {
        const game = _this.get();

        if (game && game.id) {
            return axios
                .get(
                    `${process.env.API_URL}:${process.env.API_PORT}/games/${game.id}/invitations`
                )
                .then(res => socket.emit('getInvitations', res.data))
                .catch(() => {});
        }
    },

    /**
     * Accepte ou refuse une invitation
     *
     * @param string gameId Identifiant de la partie
     * @param int invitationId Identifiant de l'invitation
     * @param boolean accepted Si l'invitation a été acceptée ou refusée
     * @param object socket Objet Socket.io
     */
    acceptInvitation: (gameId, invitationId, accepted, socket) => {
        axios
            .put(
                `${process.env.API_URL}:${process.env.API_PORT}/games/${gameId}/invitations/${invitationId}`,
                { accepted }
            )
            .then(() => {
                _this.getInvitations(socket);
            })
            .catch(() => {});
    },

    /**
     * Rend la partie publique
     *
     * @param object socket Objet Socket.io
     */
    publish: socket => {
        const config = config_ctrl.get(),
            game = _this.get();

        if (game && game.id) {
            axios
                .put(
                    `${process.env.API_URL}:${process.env.API_PORT}/games/${game.id}`,
                    {
                        published: true
                    }
                )
                .then(() => (config.published = true))
                .catch(() => {})
                .finally(() => socket.emit('getConfig', config));
        }
    },

    /**
     * Lance la partie
     *
     * @param object io Objet Socket.io
     */
    launch: io => {
        const game = _this.get(),
            config = config_ctrl.get();

        if (game && game.id) {
            axios
                .put(
                    `${process.env.API_URL}:${process.env.API_PORT}/games/${game.id}`,
                    {
                        launched: true
                    }
                )
                .then(() => {
                    config.launched = true;
                    config.launchedAt = new Date();
                })
                .catch(() => {})
                .finally(() => io.emit('getConfig', config));
        } else {
            config.launched = true;
            config.launchedAt = new Date();
            io.emit('getConfig', config);
        }

        const teams = team_ctrl.getAll();
        teams.forEach(t => t.players.length === 0 && team_ctrl.delete(t.id));

        if (config.duration) {
            const gameTimeout = setTimeout(() => {
                _this.end(io);
            }, config.duration * 1000);
            interval_ctrl.createGameTimeout(gameTimeout, config.id);
        }
    },

    /**
     * Lance la partie à une certaine date
     *
     * @param object Objet Socket.io
     * @param date date Date de lancement
     */
    launchAt: (io, date) => {
        if (moment().isSameOrAfter(date)) {
            _this.launch(io);
        } else {
            const config = config_ctrl.get();
            config.willLaunchAt = date;
            io.emit('getConfig', config);

            setTimeout(() => {
                if (moment().isSameOrAfter(date)) {
                    _this.launch(io);
                } else {
                    const interval = setInterval(() => {
                        if (moment().isSameOrAfter(date)) {
                            clearInterval(interval);
                            _this.launch(io);
                        }
                    }, 3600000);
                }
            }, 3600000 - (moment().minutes() * 60 + moment().seconds()) * 1000 + moment().milliseconds());

            const game = _this.get();
            if (game && game.id) {
                axios.put(
                    `${process.env.API_URL}:${process.env.API_PORT}/games/${game.id}`,
                    {
                        willLaunchAt: date
                    }
                );
            }
        }
    },

    /**
     * Termine la partie
     *
     * @param object io Objet Socket.io
     */
    end: io => {
        const config = config_ctrl.get(),
            game = _this.get();

        axios
            .put(
                `${process.env.API_URL}:${process.env.API_PORT}/games/${game.id}`,
                {
                    ended: true
                }
            )
            .catch(() => {})
            .finally(() => {
                interval_ctrl.removeAll();
                config.ended = true;
                config.winners = _this.findWinners();
                _this.sendStats();
                io.emit('getConfig', config);
            });
    },

    /**
     * Renvoie l'équipe qui a gagné la partie, en cas d'égalité renvoie celles qui
     * ont le plus haut score
     */
    findWinners: () => {
        const teams = team_ctrl.getAll();
        const maxScore = _.maxBy(teams, 'score').score;
        const winners = teams.filter(t => t.score === maxScore);

        player_ctrl.getAll().forEach(player => {
            if (_.find(winners, { id: player.teamId })) {
                player.statistics.hasWon = winners.length === 1;
                player.statistics.hasLost = false;
            } else {
                player.statistics.hasWon = false;
                player.statistics.hasLost = true;
            }
        });

        return winners;
    },

    /**
     * Stocke les statistiques de chzque joueur dans le serveur central
     */
    sendStats: () => {
        const game = _this.get();

        player_ctrl.getAll().forEach(player => {
            const team = team_ctrl.getById(player.teamId);
            player.statistics.teamName = team.name;
            player.statistics.teamColor = team.color;
            player.statistics.teamScore = team.score;

            axios
                .post(
                    `${process.env.API_URL}:${process.env.API_PORT}/games/${game.id}/history`,
                    {
                        UserId: player.id,
                        ...player.statistics
                    }
                )
                .catch(() => {});
        });
    }
});
