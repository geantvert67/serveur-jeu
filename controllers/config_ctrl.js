const axios = require('axios'),
    moment = require('moment'),
    { config_store, game_store } = require('../stores');

const _this = (module.exports = {
    get: () => {
        return config_store.get();
    },

    launch: io => {
        const game = game_store.get();

        if (game && game.id) {
            axios
                .delete(
                    `${process.env.API_URL}:${process.env.API_PORT}/games/${game.id}`
                )
                .then(() => (config_store.get().launched = true))
                .catch(() => {})
                .finally(() => io.emit('getConfig', config_store.get()));
        } else {
            const config = config_store.get();
            config.launched = true;
            io.emit('getConfig', config);
        }
    },

    launchAt: (io, date) => {
        if (moment().isSameOrAfter(date)) {
            _this.launch(io);
        } else {
            const config = config_store.get();
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
        return config_store.get().launched;
    }
});
