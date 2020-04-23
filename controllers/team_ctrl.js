const _ = require('lodash'),
    { team_store } = require('../stores'),
    config_ctrl = require('./config_ctrl');

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
            !config_ctrl.isLaunched() &&
            !_.find(players, { username: player.username })
        ) {
            const team = _this.getById(teamId);
            player.teamId = teamId;
            player.teamColor = team.color;
            team.players.push(player);
            return true;
        }
        return false;
    },

    findByMinPlayers: () => {
        return _.minBy(team_store.getAll(), t => t.players.length);
    },

    delete: id => {
        team_store.remove(id);
    }
});
