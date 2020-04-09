const { item_instance_store } = require('../stores'),
    { ItemInstance } = require('../models');

let id = 1;

module.exports = {
    create: item => {
        const itemInstance = new ItemInstance(id, item);
        item_instance_store.add(itemInstance);
        id++;

        return itemInstance;
    }
};
