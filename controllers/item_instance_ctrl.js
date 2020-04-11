const _ = require('lodash'),
    { item_instance_store } = require('../stores'),
    { ItemInstance } = require('../models');

let id = 1;

const _this = (module.exports = {
    getAll: () => {
        return item_instance_store.getAll();
    },

    getById: id => {
        return _.find(_this.getAll(), { id });
    },

    create: item => {
        const itemInstance = new ItemInstance(id, item);
        item_instance_store.add(itemInstance);
        id++;

        return itemInstance;
    },

    delete: id => {
        item_instance_store.remove(id);
    }
});
