const _ = require('lodash'),
    { Area } = require('../models'),
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

    getMaxId: () => {
        return _.maxBy(_this.getAll(), 'id').id + 1 || 1;
    },

    createArea: forbidden => {
        area_store.add(new Area(_this.getMaxId(), [[]], forbidden));
    },

    moveArea: (coordinates, id) => {
        _this.getById(id).coordinates = coordinates;
    },

    deleteArea: id => {
        area_store.remove(id);
    },

    deleteForbiddenAreas: () => {
        _this.getForbiddenAreas().forEach(a => _this.deleteArea(a.id));
    }
});
