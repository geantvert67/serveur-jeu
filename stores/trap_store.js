const _ = require('lodash'),
    traps = [];

module.exports = {
    getAll: () => traps,
    add: t => traps.push(t),
    remove: id => _.remove(traps, t => t.id === id),
    removeAll: () => (traps.length = 0)
};
