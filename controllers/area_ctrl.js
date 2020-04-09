const _ = require('lodash'),
    { area_store } = require('../stores');

const _this = (module.exports = {
    getAll: () => {
        return area_store.getAll();
    },

    getById: id => {
        return _.find(_this.getAll(), { id });
    },

    getGameArea: () => {
        return _this.getAll().filter(a => !a.forbidden)[0];
    },

    getForbiddenAreas: () => {
        return _this.getAll().filter(a => a.forbidden);
    },

    moveArea: (coordinates, id) => {
        _this.getById(id).coordinates = coordinates;
    }
});
