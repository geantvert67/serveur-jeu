const _ = require('lodash'),
    { item_model_store } = require('../stores');

const _this = (module.exports = {
    getAll: () => {
        return item_model_store.getAll();
    },

    getById: id => {
        return _.find(_this.getAll(), { id });
    },

    getByName: name => {
        return _.find(_this.getAll(), { name });
    },

    update: (id, newItem) => {
        let item = _this.getById(id);
        Object.keys(newItem)
            .filter(e => newItem[e])
            .forEach(e => (item[e] = newItem[e]));
    }
});
