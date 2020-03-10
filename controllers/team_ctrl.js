const _ = require('lodash'),
    { team_store } = require('../stores'),
    { Player } = require('../models'),
    confif_ctrl = require('./config_ctrl');

const _this = (module.exports = {
    getAll: () => {
        return team_store.getAll();
    },

    getById: teamId => {
        return _.find(team_store.getAll(), t => t.id === teamId);
    },

    getPlayer: username => {
        return _.find(_this.getPlayers(), { username });
    },

    getPlayers: () => {
        const players = [];
        _this.getAll().map(t => t.players.map(p => players.push(p)));
        return players;
    },

    addPlayer: (teamId, username) => {
        const players = _this.getPlayers();
        const player = new Player(username);

        if (!confif_ctrl.isLaunched() && !_.some(players, player)) {
            _this.getById(teamId).players.push(player);
            return true;
        }
        return false;
    },

    findByMinPlayers: () => {
        return _.minBy(team_store.getAll(), t => t.players.length);
    }
});
