const _ = require('lodash'),
    geolib = require('geolib'),
    moment = require('moment'),
    config_ctrl = require('./config_ctrl'),
    item_instance_ctrl = require('./item_instance_ctrl'),
    area_ctrl = require('./area_ctrl'),
    { item_store } = require('../stores'),
    { getRandomPoint } = require('../utils');

const _this = (module.exports = {
    getAll: () => {
        return item_store.getAll();
    },

    getById: id => {
        return _.find(_this.getAll(), { id });
    },

    getInRadius: (coordinates, checkVisibility, inActionRadius = []) => {
        return _this.getAll().filter(
            i =>
                !_.some(inActionRadius, i) &&
                geolib.isPointWithinRadius(
                    {
                        latitude: coordinates[0],
                        longitude: coordinates[1]
                    },
                    {
                        latitude: i.coordinates[0],
                        longitude: i.coordinates[1]
                    },
                    checkVisibility ? i.visibilityRadius : i.actionRadius
                )
        );
    },

    takeItem: (player, id) => {
        const { inventorySize } = config_ctrl.get();
        const item = _this.getById(id);

        if (
            player.inventory.length < inventorySize &&
            (!item.waitingUntil || moment().isSameOrAfter(item.waitingUntil))
        ) {
            const { waitingPeriod } = item;
            const itemInstance = item_instance_ctrl.create(item);

            if (itemInstance) {
                player.inventory.push(itemInstance);
                if (item.quantity > 1) {
                    item.quantity--;

                    if (waitingPeriod) {
                        item.waitingUntil = moment().add(waitingPeriod, 's');
                        setTimeout(() => {
                            item.waitingUntil = null;
                        }, waitingPeriod * 1000);
                    }
                    if (item.autoMove) {
                        item.coordinates = getRandomPoint(
                            area_ctrl.getGameArea(),
                            area_ctrl.getForbiddenAreas()
                        );
                    }
                } else {
                    _this.delete(item.id);
                }
            }
        }
    },

    moveItem: (coordinates, itemId) => {
        _this.getById(itemId).coordinates = coordinates;
    },

    delete: id => {
        item_store.remove(id);
    }
});
