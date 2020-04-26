const _ = require('lodash'),
    geolib = require('geolib'),
    { trap_store } = require('../stores'),
    { Trap } = require('../models'),
    item_instance_ctrl = require('./item_instance_ctrl'),
    item_ctrl = require('./item_ctrl'),
    interval_ctrl = require('./interval_ctrl');

let id = 1;

const _this = (module.exports = {
    getAll: () => {
        return trap_store.getAll();
    },

    getById: id => {
        return _.find(_this.getAll(), { id });
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

    create: (item, player, coordinates) => {
        const trap = new Trap(id, item, player, coordinates);

        trap_store.add(trap);
        id++;
        return trap;
    },

    moveTrap: (coordinates, trapId) => {
        _this.getById(trapId).coordinates = coordinates;
    },

    delete: id => {
        const trap = _this.getById(id);

        interval_ctrl.removeTrapIntervalByObjectId(id);
        item_instance_ctrl.delete(trap.itemInstanceId, trap.owner);
        trap_store.remove(id);
    },

    routine: player => {
        _this
            .getAll()
            .filter(t => !t.inactiveUntil)
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
                    } else if (t.name === 'Transducteur') {
                        _this.transducteurEffect(player, t);
                    }
                }
            });
    },

    canonEffect: (target, trap) => {
        target.immobilized = true;

        setTimeout(() => {
            target.immobilized = false;
        }, trap.effectDuration * 1000);
        _this.delete(trap.id);
    },

    transducteurEffect: (target, trap) => {
        const inventorySize = target.inventory.length;
        if (inventorySize > 0) {
            const item = target.inventory.splice(inventorySize - 1)[0];
            item.equiped = false;
            item_ctrl.giveItem(trap.owner, item);
        }

        item_instance_ctrl.delete(trap.itemInstanceId, trap.owner);
        _this.delete(trap.id);
    }
});
