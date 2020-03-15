const { marker_store } = require('../stores'),
    { Marker } = require('../models'),
    team_ctrl = require('./team_ctrl');

let id = 1;

module.exports = {
    getAll: () => {
        return marker_store.getAll();
    },

    create: (coordinates, isPositive, teamId) => {
        marker_store.add(
            new Marker(id, coordinates, isPositive, team_ctrl.getById(teamId))
        );

        id++;
    }
};
