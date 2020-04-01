const _ = require('lodash'),
    { area_store } = require('../stores');

const _this = (module.exports = {
    getAll: () => {
        return area_store.getAll();
    },

    getById: id => {
        return _.find(_this.getAll(), { id });
    },

    moveArea: (coordinates, id) => {
        _this.getById(id).coordinates = coordinates;
    }
});
