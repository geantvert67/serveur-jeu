const _ = require('lodash'),
    geolib = require('geolib'),
    moment = require('moment'),
    config_ctrl = require('./config_ctrl'),
    item_instance_ctrl = require('./item_instance_ctrl'),
    item_model_ctrl = require('./item_model_ctrl');
(interval_ctrl = require('./interval_ctrl')),
    (area_ctrl = require('./area_ctrl')),
    ({ Item } = require('../models')),
    ({ item_store } = require('../stores')),
    ({ getRandomPoint, calculateRadius } = require('../utils'));

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

    getMaxId: () => {
        if (id) {
            id++;
            return id;
        } else {
            const item = _.maxBy(_this.getAll(), 'id');
            return item ? item.id + 1 : 1;
        }
    },

    createItem: (coordinates, name) => {
        const itemModel = item_model_ctrl.getByName(name);

        if (itemModel) {
            return _this.create(itemModel, coordinates);
        }
        return null;
    },

    create: (item, coordinates) => {
        const i = _.cloneDeep(item);
        i.id = _this.getMaxId();
        i.quantity = 1;
        i.position = { coordinates };

        const newItem = new Item(i);
        item_store.add(newItem);
        return newItem;
    },

    createRandom: (nbItems, name) => {
        for (let i = 0; i < nbItems; i++) {
            const coordinates = getRandomPoint(
                area_ctrl.getGameArea(),
                area_ctrl.getForbiddenAreas()
            );
            _this.createItem(coordinates, name);
        }
    },

    isInventoryNotFull: player => {
        const { inventorySize } = config_ctrl.get();
        const maxInventorySize = player.hasTransporteur
            ? inventorySize * 2
            : inventorySize;

        return player.inventory.length < maxInventorySize;
    },

    takeItem: (player, id) => {
        const item = _this.getById(id);

        if (
            _this.isInventoryNotFull(player) &&
            (!item.waitingUntil || moment().isSameOrAfter(item.waitingUntil))
        ) {
            const { waitingPeriod } = item;
            const itemInstance = item_instance_ctrl.create(item);

            if (itemInstance) {
                player.inventory.push(itemInstance);
                if (item.quantity > 1) {
                    item.quantity--;
                    item.nbUpdates++;

                    if (waitingPeriod) {
                        item.waitingUntil = moment().add(waitingPeriod, 's');
                        const interval = setTimeout(() => {
                            item.waitingUntil = null;
                            item.nbUpdates++;
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
        _this.create(_.cloneDeep(item), coordinates);
        item_instance_ctrl.delete(id, player);
    },

    moveItem: (coordinates, itemId) => {
        const item = _this.getById(itemId);
        item.coordinates = coordinates;
        item.nbUpdates++;
    },

    delete: id => {
        item_store.remove(id);
        interval_ctrl.removeItemIntervalByObjectId(id);
    },

    deleteByName: name => {
        _this
            .getAll()
            .filter(i => i.name === name)
            .forEach(i => {
                item_store.remove(i.id);
                interval_ctrl.removeItemIntervalByObjectId(i.id);
            });
    },

    randomize: () => {
        _this.getAll().forEach(i => {
            i.coordinates = getRandomPoint(
                area_ctrl.getGameArea(),
                area_ctrl.getForbiddenAreas()
            );
            i.nbUpdates++;
        });
    }
});
