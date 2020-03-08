const initialValues = require('../config.json'),
    { Config, Team, Area, Flag } = require('../models'),
    team_ctrl = require('./team_ctrl'),
    { config_store, team_store, area_store, flag_store } = require('../stores');

module.exports = {
    import_config: () => {
        config_store.set(new Config(initialValues));

        initialValues.Teams.map(t => {
            team = new Team(t);
            team_store.add(team);
            t.Users.map(u => team_ctrl.addPlayer(team.id, u.username));
        });
        initialValues.Areas.map(a => area_store.add(new Area(a)));
        initialValues.Flags.map(f => flag_store.add(new Flag(f)));
    }
};
