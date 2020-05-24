const _ = require('lodash'),
    items = [];

/**
 * Gestion des items
 */
module.exports = {
    getAll: () => items,
    add: i => items.push(i),
    remove: id => _.remove(items, i => i.id === id),
    removeAll: () => (items.length = 0)
};
