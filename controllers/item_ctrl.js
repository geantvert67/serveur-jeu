const _ = require('lodash'),
    geolib = require('geolib'),
    moment = require('moment'),
    config_ctrl = require('./config_ctrl'),
    item_instance_ctrl = require('./item_instance_ctrl'),
    interval_ctrl = require('./interval_ctrl'),
    area_ctrl = require('./area_ctrl'),
    { Item } = require('../models'),
    { item_store } = require('../stores'),
    { getRandomPoint, calculateRadius } = require('../utils');

let id = null;

const _this = (module.exports = {
    getAll: () => {
        return item_store.getAll();
    },

    getById: id => {
        return _.find(_this.getAll(), { id });
    },

    getInRadius: (
        coordinates,
        checkVisibility,
        inActionRadius = [],
        radiusChange = []
    ) => {
        return _this.getAll().filter(i => {
            const radius = checkVisibility
                ? i.visibilityRadius
                : i.actionRadius;

            return (
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
                    calculateRadius(radius, radiusChange)
                )
            );
        });
    },

    create: (item, coordinates) => {
        if (id) {
            id++;
        } else {
            const maxId = _.maxBy(_this.getAll(), 'id');
            id = maxId ? maxId.id + 1 : 1;
        }

        item.id = id;
        item.quantity = 1;
        item.position = { coordinates };
        item_store.add(new Item(item));
    },

    takeItem: (player, id) => {
        const { inventorySize } = config_ctrl.get();
        const maxInventorySize = player.hasTransporteur
            ? inventorySize * 2
            : inventorySize;
        const item = _this.getById(id);

        if (
            player.inventory.length < maxInventorySize &&
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
                        const interval = setTimeout(() => {
                            item.waitingUntil = null;
                            interval_ctrl.removeItemIntervalByObjectId(id);
                        }, waitingPeriod * 1000);
                        interval_ctrl.createItemInterval(interval, item.id);
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

    giveItem: (player, itemInstance) => {
        const { inventorySize } = config_ctrl.get();
        const maxInventorySize = player.hasTransporteur
            ? inventorySize * 2
            : inventorySize;

        if (player.inventory.length < maxInventorySize) {
            player.inventory.push(itemInstance);
            return true;
        }
        return false;
    },

    dropItem: (player, id, coordinates) => {
        const item = item_instance_ctrl.getById(id);
        if (!item.equiped) {
            _this.create(_.cloneDeep(item), coordinates);
            item_instance_ctrl.delete(id, player);
        }
    },

    moveItem: (coordinates, itemId) => {
        _this.getById(itemId).coordinates = coordinates;
    },

    delete: id => {
        item_store.remove(id);
        interval_ctrl.removeItemIntervalByObjectId(id);
    },

    randomize: () => {
        _this
            .getAll()
            .forEach(
                i =>
                    (i.coordinates = getRandomPoint(
                        area_ctrl.getGameArea(),
                        area_ctrl.getForbiddenAreas()
                    ))
            );
    }
});
