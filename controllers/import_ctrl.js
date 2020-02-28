const initialValues = require('../config.json'),
    { Config, Team, Area } = require('../models'),
    { config_store, team_store, area_store } = require('../stores');

module.exports = {
    import_config: () => {
        config_store.set(new Config(initialValues));

        initialValues.Teams.map(t => team_store.add(new Team(t)));
        initialValues.Areas.map(a => area_store.add(new Area(a)));
    }
};
