const initialValues = require('../config.json'),
    { Config, Team } = require('../models'),
    { config_store, team_store } = require('../stores');

module.exports = {
    import_config: () => {
        config_store.set(new Config(initialValues));

        initialValues.Teams.map(t => team_store.add(new Team(t)));
    }
};
