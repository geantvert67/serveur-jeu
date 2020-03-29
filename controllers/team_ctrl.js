const _ = require('lodash'),
    { team_store } = require('../stores'),
    game_ctrl = require('./game_ctrl');

const _this = (module.exports = {
    getAll: () => {
        return team_store.getAll();
    },

    getById: id => {
        return _.find(team_store.getAll(), { id });
    },

    getPlayer: username => {
        return _.find(_this.getPlayers(), { username });
    },

    getPlayers: () => {
        const players = [];
        _this.getAll().map(t => t.players.map(p => players.push(p)));
        return players;
    },

    getTeamPlayers: teamId => {
        return _this.getById(teamId).players;
    },

    addPlayer: (teamId, player) => {
        const players = _this.getPlayers();

        if (
            !game_ctrl.isLaunched() &&
            !_.find(players, { username: player.username })
        ) {
            player.teamId = teamId;
            _this.getById(teamId).players.push(player);
            return true;
        }
        return false;
    },

    findByMinPlayers: () => {
        return _.minBy(team_store.getAll(), t => t.players.length);
    }
});
