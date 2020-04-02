const _ = require('lodash'),
    geolib = require('geolib'),
    { player_store } = require('../stores'),
    { Player } = require('../models'),
    game_ctrl = require('./game_ctrl');

const _this = (module.exports = {
    getAll: () => {
        return player_store.getAll();
    },

    getOrCreate: (username, isConnected) => {
        if (!username) return null;

        const player = new Player(username, isConnected),
            p = _.find(_this.getAll(), { username });

        if (!p) {
            if (!game_ctrl.isLaunched()) {
                player_store.add(player);
                return player;
            }
            return null;
        }

        p.isConnected = true;
        return p;
    },

    getInRadius: (coordinates, teamId, radius, inActionRadius = []) => {
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
                    radius
                )
        );
    }
});
