const _ = require('lodash'),
    itemInstances = [];

module.exports = {
    getAll: () => itemInstances,
    add: i => itemInstances.push(i),
    remove: id => _.remove(itemInstances, i => i.id === id),
    removeAll: () => (itemInstances.length = 0)
};
