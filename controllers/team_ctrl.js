const _ = require('lodash'),
    { team_store } = require('../stores'),
    { Player } = require('../models');

const _this = (module.exports = {
    getAll: () => {
        return team_store.getAll();
    },

    getById: teamId => {
        return _.find(team_store.getAll(), t => t.id === teamId);
    },

    getPlayers: () => {
        const players = [];
        _this.getAll().map(t => t.players.map(p => players.push(p)));
        return players;
    },

    getTeamPlayers: teamId => {
        return _this.getById(teamId).players;
    },

    addPlayer: (teamId, username) => {
        const players = _this.getPlayers();
        const player = new Player(username);

        if (!_.some(players, player)) {
            _this.getById(teamId).players.push(player);
            return player;
        }
    },

    findByMinPlayers: () => {
        return _.minBy(team_store.getAll(), t => t.players.length);
    }
});
