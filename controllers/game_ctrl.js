const axios = require('axios'),
    moment = require('moment'),
    ip = process.env.ip || '127.0.0.1',
    port = process.env.port || 8888,
    { game_store } = require('../stores'),
    { Game } = require('../models'),
    config_ctrl = require('./config_ctrl');

const _this = (module.exports = {
    get: () => {
        return game_store.get();
    },

    publish: socket => {
        const config = config_ctrl.get();

        axios
            .post(`${process.env.API_URL}:${process.env.API_PORT}/games`, {
                ip,
                port,
                configId: config.id
            })
            .then(res => {
                game_store.set(new Game(res.data));
                config.published = true;
            })
            .catch(() => {})
            .finally(() => socket.emit('getConfig', config));
    },

    launch: io => {
        const game = _this.get();

        if (game && game.id) {
            axios
                .delete(
                    `${process.env.API_URL}:${process.env.API_PORT}/games/${game.id}`
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
