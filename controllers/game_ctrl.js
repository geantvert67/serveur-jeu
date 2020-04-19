const axios = require('axios'),
    _ = require('lodash'),
    moment = require('moment'),
    { game_store } = require('../stores'),
    team_ctrl = require('./team_ctrl'),
    config_ctrl = require('./config_ctrl'),
    interval_ctrl = require('./interval_ctrl');

const _this = (module.exports = {
    get: () => {
        return game_store.get();
    },

    getInvitations: io => {
        const game = _this.get();

        if (game && game.id) {
            return axios
                .get(
                    `${process.env.API_URL}:${process.env.API_PORT}/games/${game.id}/invitations`
                )
                .then(res => io.emit('getInvitations', res.data))
                .catch(() => {});
        }
    },

    acceptInvitation: (gameId, invitationId, accepted) => {
        return axios.put(
            `${process.env.API_URL}:${process.env.API_PORT}/games/${gameId}/invitations/${invitationId}`,
            { accepted }
        );
    },

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
            const config = config_ctrl.get();
            config.launched = true;
            config.launchedAt = new Date();
            io.emit('getConfig', config);
        }

        if (config.duration) {
            setTimeout(() => {
                _this.end(io);
            }, config.duration * 1000);
        }
    },

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
        }
    },

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
                io.emit('getConfig', config);
            });
    },

    findWinners: () => {
        const teams = team_ctrl.getAll();
        const maxScore = _.maxBy(teams, 'score').score;
        return teams.filter(t => t.score === maxScore);
    }
});
