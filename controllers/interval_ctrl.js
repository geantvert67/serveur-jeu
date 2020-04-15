const _ = require('lodash'),
    { Interval } = require('../models'),
    { interval_store } = require('../stores');

let id = 1;

const _this = (module.exports = {
    getAll: () => {
        return interval_store.getAll();
    },

    create: (interval, objectId) => {
        interval_store.add(new Interval(id, interval, objectId));
        id++;
    },

    removeByObjectId: objectId => {
        const i = _.find(_this.getAll(), { objectId });
        if (i) {
            clearInterval(i.interval);
            interval_store.remove(i.id);
        }
    }
});
