const _ = require('lodash'),
    { item_model_store } = require('../stores');

const _this = (module.exports = {
    getAll: () => {
        return item_model_store.getAll();
    },

    getByName: name => {
        return _.find(_this.getAll(), { name });
    }
});
