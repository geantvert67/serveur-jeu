const axios = require('axios'),
    { config_store, game_store } = require('../stores');

module.exports = {
    get: () => {
        return config_store.get();
    },

    launch: () => {
        const game = game_store.get();

        if (game && game.id) {
            return axios
                .delete(
                    `${process.env.API_URL}:${process.env.API_PORT}/games/${game.id}`
                )
                .then(() => (config_store.get().launched = true))
                .catch(() => {});
        } else {
            config_store.get().launched = true;
            return new Promise((resolve, reject) => resolve());
        }
    },

    isLaunched: () => {
        return config_store.get().launched;
    }
};
