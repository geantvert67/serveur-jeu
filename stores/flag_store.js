const _ = require('lodash'),
    flags = [];

module.exports = {
    getAll: () => flags,
    add: f => flags.push(f),
    remove: id => _.remove(flags, f => f.id === id)
};
