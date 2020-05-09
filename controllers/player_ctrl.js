const _ = require('lodash'),
    geolib = require('geolib'),
    { player_store } = require('../stores'),
    { Player } = require('../models'),
    config_ctrl = require('./config_ctrl'),
    { calculateRadius } = require('../utils');

const _this = (module.exports = {
    getAll: () => {
        return player_store.getAll();
    },

    getByUsername: username => {
        return _.find(_this.getAll(), { username });
    },

    getOrCreate: (id, username, isConnected) => {
        if (!username || !id) return null;

        const player = new Player(id, username, isConnected),
            p = _.find(_this.getAll(), { username });

        if (!p) {
            if (!config_ctrl.isLaunched()) {
                player_store.add(player);
                return player;
            }
            return null;
        }

        p.isConnected = true;
        return p;
    },

    getInRadius: (
        coordinates,
        teamId,
        radius,
        inActionRadius = [],
        radiusChange = []
    ) => {
        return _this.getAll().filter(
            p =>
                !_.some(inActionRadius, p) &&
                p.teamId !== teamId &&
                p.coordinates.length > 0 &&
                geolib.isPointWithinRadius(
                    {
                        latitude: coordinates[0],
                        longitude: coordinates[1]
                    },
                    {
                        latitude: p.coordinates[0],
                        longitude: p.coordinates[1]
                    },
                    calculateRadius(radius, radiusChange)
                )
        );
    }
});
