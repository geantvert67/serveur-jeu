const axios = require('axios'),
    initialValues = require('../config.json'),
    { Config, Team, Area, Flag, Game, ItemModel, Item } = require('../models'),
    team_ctrl = require('./team_ctrl'),
    player_ctrl = require('./player_ctrl'),
    {
        config_store,
        team_store,
        area_store,
        flag_store,
        item_model_store,
        item_store,
        game_store
    } = require('../stores');
(ip = process.env.ip || '127.0.0.1'), (port = process.env.port || 8888);

module.exports = {
    import_config: () => {
        config_store.set(new Config(initialValues));

        initialValues.Teams.map(t => {
            team = new Team(t);
            team_store.add(team);
            t.Users.map(u => {
                team_ctrl.addPlayer(
                    team.id,
                    player_ctrl.getOrCreate(u.username, false)
                );
            });
        });
        initialValues.Areas.map(a => area_store.add(new Area(a)));
        initialValues.Flags.map(f => flag_store.add(new Flag(f)));
        initialValues.ItemModels.map(im => {
            itemModel = new ItemModel(im);
            item_model_store.add(itemModel);
            im.Items.map(i => {
                item_store.add(new Item(i, itemModel));
            });
        });

        return axios
            .post(`${process.env.API_URL}:${process.env.API_PORT}/games`, {
                ip,
                port,
                configId: initialValues.id
            })
            .then(res => game_store.set(new Game(res.data)))
            .catch(() => {});
    }
};
