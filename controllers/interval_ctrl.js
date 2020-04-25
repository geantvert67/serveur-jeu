const _ = require('lodash'),
    { Interval } = require('../models'),
    { interval_store } = require('../stores');

let idFlagInterval = 1;

const _this = (module.exports = {
    getAllIntervals: () => {
        return interval_store.getAllIntervals();
    },

    getAllTimers: () => {
        return interval_store.getAllTimers();
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
        const i = _.find(_this.getAllFlagIntervals(), { objectId });
        if (i) {
            clearInterval(i.interval);
            interval_store.removeFlagInterval(i.id);
        }
    },

    createGameTimeout: (timeout, configId) => {
        interval_store.addGameTimeout(new Interval(1, timeout, configId));
    },

    removeAll: () => {
        _this.getAllIntervals().forEach(i => {
            clearInterval(i.interval);
        });
        _this.getAllTimers().forEach(i => {
            clearTimeout(i.interval);
        });

        interval_store.removeAll();
    }
});
