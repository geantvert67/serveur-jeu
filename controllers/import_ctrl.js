const axios = require('axios'),
    ip = process.env.IP || '127.0.0.1',
    port = process.env.PORT || 8888,
    initialValues = require('../config.json'),
    { Config, Game, Team, Area, Flag, ItemModel, Item } = require('../models'),
    team_ctrl = require('./team_ctrl'),
    player_ctrl = require('./player_ctrl'),
    {
        config_store,
        game_store,
        team_store,
        area_store,
        flag_store,
        item_instance_store,
        item_model_store,
        item_store,
        marker_store,
        player_store,
        trap_store
    } = require('../stores');

const _this = (module.exports = {
    createGame: () => {
        return axios
            .post(`${process.env.API_URL}:${process.env.API_PORT}/games`, {
                ip,
                port,
                name: initialValues.name,
                gameMode: initialValues.gameMode,
                AdminId: initialValues.OwnerId
            })
            .then(res => {
                game_store.set(new Game(res.data));
            })
            .catch(() => {});
    },

    createInvitation: (gameId, userId) => {
        return axios
            .post(
                `${process.env.API_URL}:${process.env.API_PORT}/games/${gameId}/invitations`,
                {
                    userId,
                    accepted: true
                }
            )
            .catch(() => {});
    },

    reset: () => {
        area_store.removeAll();
        config_store.set(null);
        flag_store.removeAll();
        game_store.set(null);
        item_instance_store.removeAll();
        item_model_store.removeAll();
        item_store.removeAll();
        marker_store.removeAll();
        player_store.removeAll();
        team_store.removeAll();
        trap_store.removeAll();
    },

    importConfig: (socket = null) => {
        _this.reset();
        config_store.set(new Config(initialValues));

        _this.createGame().finally(() => {
            const gameId = game_store.get().id;

            initialValues.Teams.map(t => {
                team = new Team(t);
                team_store.add(team);
                t.Users.map(u => {
                    team_ctrl.addPlayer(
                        team.id,
                        player_ctrl.getOrCreate(u.id, u.username, false)
                    );
                    _this.createInvitation(gameId, u.id);
                });
            });
            initialValues.Areas.map(a =>
                area_store.add(
                    new Area(a.id, a.position.coordinates, a.forbidden)
                )
            );
            initialValues.Flags.map(f =>
                flag_store.add(new Flag(f.id, f.position.coordinates))
            );
            initialValues.ItemModels.map(im =>
                item_model_store.add(new ItemModel(im))
            );
            initialValues.Items.map(i => item_store.add(new Item(i)));

            socket && socket.emit('getConfig', config_store.get());
        });
    }
});
