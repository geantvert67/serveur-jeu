const _ = require('lodash'),
    markers = [];

module.exports = {
    getAll: () => markers,
    add: m => markers.push(m),
    remove: id => _.remove(markers, m => m.id === id)
};
