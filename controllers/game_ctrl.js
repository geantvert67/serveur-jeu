const axios = require('axios'),
    moment = require('moment'),
    { game_store } = require('../stores'),
    config_ctrl = require('./config_ctrl');

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
        const game = _this.get();

        if (game && game.id) {
            axios
                .put(
                    `${process.env.API_URL}:${process.env.API_PORT}/games/${game.id}`,
                    {
                        launched: true
                    }
                )
                .then(() => (config_ctrl.get().launched = true))
                .catch(() => {})
                .finally(() => io.emit('getConfig', config_ctrl.get()));
        } else {
            const config = config_ctrl.get();
            config.launched = true;
            io.emit('getConfig', config);
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

    isLaunched: () => {
        return config_ctrl.get().launched;
    }
});
