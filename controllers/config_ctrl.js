const { config_store } = require('../stores');

const _this = (module.exports = {
    get: () => {
        return config_store.get();
    },

    update: newConfig => {
        const config = _this.get();
        config_store.set({ ...config, ...newConfig });
    },

    isLaunched: () => {
        return _this.get().launched;
    }
});
