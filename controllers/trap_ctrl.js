const _ = require('lodash'),
    geolib = require('geolib'),
    { trap_store } = require('../stores'),
    { Trap } = require('../models'),
    interval_ctrl = require('./interval_ctrl');

let id = 1;

const _this = (module.exports = {
    getAll: () => {
        return trap_store.getAll();
    },

    getInRadius: coordinates => {
        return _this.getAll().filter(i =>
            geolib.isPointWithinRadius(
                {
                    latitude: coordinates[0],
                    longitude: coordinates[1]
                },
                {
                    latitude: i.coordinates[0],
                    longitude: i.coordinates[1]
                },
                i.visibilityRadius
            )
        );
    },

    create: (item, coordinates) => {
        const trap = new Trap(id, item, coordinates);

        trap_store.add(trap);
        id++;
        return trap;
    },

    delete: id => {
        interval_ctrl.removeTrapIntervalByObjectId(id);
        trap_store.remove(id);
    },

    routine: player => {
        _this
            .getAll()
            .filter(t => t.active)
            .forEach(t => {
                if (
                    geolib.isPointWithinRadius(
                        {
                            latitude: player.coordinates[0],
                            longitude: player.coordinates[1]
                        },
                        {
                            latitude: t.coordinates[0],
                            longitude: t.coordinates[1]
                        },
                        t.actionRadius
                    )
                ) {
                    if (t.name === 'Canon à photons') {
                        _this.canonEffect(player, t);
                    }
                }
            });
    },

    canonEffect: (player, trap) => {
        player.immobilized = true;

        setTimeout(() => {
            player.immobilized = false;
        }, trap.effectDuration * 1000);
        _this.delete(trap.id);
    }
});
