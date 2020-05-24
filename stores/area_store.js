const _ = require('lodash'),
    areas = [];

/**
 * Gestion des zones
 */
module.exports = {
    getAll: () => areas,
    add: a => areas.push(a),
    remove: id => _.remove(areas, a => a.id === id),
    removeAll: () => (areas.length = 0)
};
