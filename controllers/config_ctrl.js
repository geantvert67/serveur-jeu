const { config_store } = require('../stores');

module.exports = {
    launch: () => {
        config_store.get().launched = true;
    }
};
