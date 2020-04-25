const _ = require('lodash'),
    flagIntervals = [];
let gameTimeout = null;

module.exports = {
    getAllIntervals: () => flagIntervals,
    getAllTimers: () => [gameTimeout],
    getAllFlagIntervals: () => flagIntervals,
    addFlagInterval: i => flagIntervals.push(i),
    removeFlagInterval: id => _.remove(flagIntervals, i => i.id === id),
    addGameTimeout: i => (gameTimeout = i),
    removeAll: () => {
        flagIntervals.length = 0;
        gameTimeout = null;
    }
};
