const _ = require('lodash'),
    flagIntervals = [],
    itemIntervals = [];
let gameTimeout = null;

module.exports = {
    getAllIntervals: () => [...flagIntervals, ...itemIntervals],
    getAllTimers: () => [gameTimeout],
    getAllFlagIntervals: () => flagIntervals,
    addFlagInterval: i => flagIntervals.push(i),
    removeFlagInterval: id => _.remove(flagIntervals, i => i.id === id),
    getAllItemIntervals: () => itemIntervals,
    addItemInterval: i => itemIntervals.push(i),
    removeItemInterval: id => _.remove(itemIntervals, i => i.id === id),
    addGameTimeout: i => (gameTimeout = i),
    removeAll: () => {
        flagIntervals.length = 0;
        itemIntervals.length = 0;
        gameTimeout = null;
    }
};
