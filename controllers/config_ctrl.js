const { config_store } = require('../stores');

module.exports = {
    get: () => {
        return config_store.get();
    },

    launch: () => {
        config_store.get().launched = true;
    },

    isLaunched: () => {
        return config_store.get().launched;
    }
};
