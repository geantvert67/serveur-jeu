const _ = require('lodash'),
    flags = [];

/**
 * Gestion des cristaux
 */
module.exports = {
    getAll: () => flags,
    add: f => flags.push(f),
    remove: id => _.remove(flags, f => f.id === id),
    removeAll: () => (flags.length = 0)
};
