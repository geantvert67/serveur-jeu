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

    getEnnemis: teamId => {
        const ennemis = [];
        _this
            .getAll()
            .filter(t => t.id !== teamId)
            .forEach(t => t.players.forEach(p => ennemis.push(p)));
        return ennemis;
    },

    getTeamPlayers: teamId => {
        return _this.getById(teamId).players;
    },

    addPlayer: (teamId, player) => {
        const players = _this.getPlayers();
        const team = _this.getById(teamId);
        const { maxPlayers } = config_ctrl.get();

        if (
            !config_ctrl.isLaunched() &&
            (team.players.length < maxPlayers || !maxPlayers) &&
            !_.find(players, { username: player.username })
        ) {
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

    findByPlayer: username => {
        let team = null;

        _this.getAll().map(t => {
            if (_.some(t.players, { username })) {
                team = t;
            }
        });
        return team;
    },

    delete: id => {
        team_store.remove(id);
    }
});
