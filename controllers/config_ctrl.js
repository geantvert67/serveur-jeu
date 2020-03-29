const { config_store } = require('../stores');

module.exports = {
    get: () => {
        return config_store.get();
    }
};
