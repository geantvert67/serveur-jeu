const _ = require('lodash'),
    flagIntervals = [];

module.exports = {
    getAll: () => flagIntervals,
    getAllFlagIntervals: () => flagIntervals,
    addFlagInterval: i => flagIntervals.push(i),
    removeFlagInterval: id => _.remove(flagIntervals, i => i.id === id),
    removeAll: () => (flagIntervals.length = 0)
};
