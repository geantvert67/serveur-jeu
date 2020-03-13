const _ = require('lodash'),
    { player_store } = require('../stores'),
    { Player } = require('../models'),
    confif_ctrl = require('./config_ctrl');

const _this = (module.exports = {
    getAll: () => {
        return player_store.getAll();
    },

    getOrCreate: (username, isConnected) => {
        const player = new Player(username, isConnected),
            p = _.find(_this.getAll(), { username });

        if (!p) {
            if (!confif_ctrl.isLaunched()) {
                player_store.add(player);
                return player;
            }
            return null;
        }

        p.isConnected = true;
        return p;
    }
});
