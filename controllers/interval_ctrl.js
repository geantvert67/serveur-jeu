const _ = require('lodash'),
    { Interval } = require('../models'),
    { interval_store } = require('../stores');

let idFlagInterval = 1;

const _this = (module.exports = {
    getAll: () => {
        return interval_store.getAll();
    },

    getAllFlagIntervals: () => {
        return interval_store.getAllFlagIntervals();
    },

    createFlagInterval: (interval, objectId) => {
        interval_store.addFlagInterval(
            new Interval(idFlagInterval, interval, objectId)
        );
        idFlagInterval++;
    },

    removeFlagIntervalByObjectId: objectId => {
        const i = _.find(_this.getAll(), { objectId });
        if (i) {
            clearInterval(i.interval);
            interval_store.removeFlagInterval(i.id);
        }
    },

    removeAll: () => {
        _this.getAll().forEach(i => {
            clearInterval(i.interval);
        });
        interval_store.removeAll();
    }
});
