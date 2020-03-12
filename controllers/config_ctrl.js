const { config_store } = require('../stores');

const _this = (module.exports = {
    get: () => {
        return config_store.get();
    },

    launch: () => {
        _this.get().launched = true;
    },

    isLaunched: () => {
        return config_store.get().launched;
    }
});
