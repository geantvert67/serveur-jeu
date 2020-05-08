const _ = require('lodash'),
    moment = require('moment'),
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
        const trap = _this.getById(trapId);
        trap.coordinates = coordinates;
        trap.nbUpdates++;
    },

    delete: id => {
        interval_ctrl.removeTrapIntervalByObjectId(id);
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
        if (target.noyaux.length > 0) {
            const id = target.noyaux.pop();
            target.nbUpdates++;
            item_instance_ctrl.delete(id, target);
        } else {
            if (target.immobilizedUntil) {
                interval_ctrl.removePlayerIntervalById(target.id);
                const currentDuration = Math.floor(
                    moment
                        .duration(
                            moment(target.immobilizedUntil).diff(moment())
                        )
                        .asSeconds()
                );

                _this.setPlayerImmobilizationDuration(
                    target,
                    trap.effectDuration + currentDuration
                );
            } else {
                _this.setPlayerImmobilizationDuration(
                    target,
                    trap.effectDuration
                );
            }
        }

        _this.delete(trap.id);
    },

    setPlayerImmobilizationDuration: (target, duration) => {
        target.immobilizedUntil = moment().add(duration, 's');
        target.nbUpdates++;

        const timer = setTimeout(() => {
            target.immobilizedUntil = null;
            target.nbUpdates++;
            interval_ctrl.removePlayerIntervalById(target.id);
        }, duration * 1000);
        interval_ctrl.createPlayerInterval(timer, target.id);
    },

    transducteurEffect: (target, trap) => {
        if (item_ctrl.isInventoryNotFull(trap.owner)) {
            if (target.noyaux.length > 0) {
                const id = target.noyaux.pop();
                target.nbUpdates++;
                item_instance_ctrl.delete(id, target);
            } else {
                const inventory = target.inventory.filter(i => !i.equiped);
                const inventorySize = inventory.length;
                if (inventorySize > 0) {
                    const item = inventory.pop();
                    item_instance_ctrl.removeFromInventory(item.id, target);
                    item_ctrl.giveItem(trap.owner, item);
                }
            }
        }

        _this.delete(trap.id);
    }
});
