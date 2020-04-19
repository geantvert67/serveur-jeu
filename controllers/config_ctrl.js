const { config_store } = require('../stores');

const _this = (module.exports = {
    get: () => {
        return config_store.get();
    },

    isLaunched: () => {
        return _this.get().launched;
    }
});
