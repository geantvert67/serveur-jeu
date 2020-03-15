const _ = require('lodash'),
    { marker_store } = require('../stores'),
    { Marker } = require('../models'),
    team_ctrl = require('./team_ctrl');

let id = 1;

const _this = (module.exports = {
    getAll: () => {
        return marker_store.getAll();
    },

    getTeamMarkers: teamId => {
        return _.filter(_this.getAll(), m => m.team.id === teamId);
    },

    create: (coordinates, isPositive, teamId) => {
        marker_store.add(
            new Marker(id, coordinates, isPositive, team_ctrl.getById(teamId))
        );

        id++;
    },

    delete: id => {
        marker_store.remove(id);
    }
});
