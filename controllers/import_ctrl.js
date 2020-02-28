const initialValues = require('../config.json'),
    { Config } = require('../models'),
    { config_store } = require('../stores');

module.exports = {
    import_config: () => {
        config_store.set(new Config(initialValues));
    }
};
