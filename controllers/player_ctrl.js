const _ = require('lodash'),
    geolib = require('geolib'),
    { player_store } = require('../stores'),
    { Player } = require('../models'),
    config_ctrl = require('./config_ctrl');

const _this = (module.exports = {
    getAll: () => {
        return player_store.getAll();
    },

    getByUsername: username => {
        return _.find(_this.getAll(), { username });
    },

    getOrCreate: (username, isConnected) => {
        if (!username) return null;

        const player = new Player(username, isConnected),
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
        radiusChange = 0
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
                    radius + (radiusChange / 100) * radius
                )
        );
    }
});
