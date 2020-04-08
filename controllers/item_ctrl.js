const _ = require('lodash'),
    geolib = require('geolib'),
    { item_store } = require('../stores');

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

    moveItem: (coordinates, itemId) => {
        _this.getById(itemId).coordinates = coordinates;
    },

    delete: id => {
        item_store.remove(id);
    }
});
