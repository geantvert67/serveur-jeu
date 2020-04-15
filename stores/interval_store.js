const _ = require('lodash'),
    flagIntervals = [];

module.exports = {
    getAll: () => flagIntervals,
    add: i => flagIntervals.push(i),
    remove: id => _.remove(flagIntervals, i => i.id === id)
};
