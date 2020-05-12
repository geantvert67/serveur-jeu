const _ = require('lodash'),
    flagIntervals = [],
    flagCapturedIntervals = [],
    itemIntervals = [],
    trapIntervals = [],
    otherIntervals = [],
    playerIntervals = [];
let gameTimeout = null;

module.exports = {
    getAllIntervals: () => flagIntervals,
    getAllTimers: () => [
        gameTimeout,
        ...flagCapturedIntervals,
        ...itemIntervals,
        ...trapIntervals,
        ...otherIntervals,
        ...playerIntervals
    ],
    getAllFlagIntervals: () => flagIntervals,
    addFlagInterval: i => flagIntervals.push(i),
    removeFlagInterval: id => _.remove(flagIntervals, i => i.id === id),
    getAllItemIntervals: () => itemIntervals,
    addItemInterval: i => itemIntervals.push(i),
    removeItemInterval: id => _.remove(itemIntervals, i => i.id === id),
    getAllCapturedFlagIntervals: () => flagCapturedIntervals,
    addCapturedFlagInterval: i => flagCapturedIntervals.push(i),
    removeCapturedFlagInterval: id =>
        _.remove(flagCapturedIntervals, i => i.id === id),
    getAllTrapIntervals: () => trapIntervals,
    addTrapInterval: i => trapIntervals.push(i),
    removeTrapInterval: id => _.remove(trapIntervals, i => i.id === id),
    getAllOtherIntervals: () => otherIntervals,
    addOtherInterval: i => otherIntervals.push(i),
    removeOtherInterval: id => _.remove(otherIntervals, i => i.id === id),
    getAllPlayerIntervals: () => playerIntervals,
    addPlayerInterval: i => playerIntervals.push(i),
    removePlayerInterval: id => _.remove(playerIntervals, i => i.id === id),
    addGameTimeout: i => (gameTimeout = i),
    removeAll: () => {
        flagIntervals.length = 0;
        flagCapturedIntervals.length = 0;
        itemIntervals.length = 0;
        trapIntervals.length = 0;
        otherIntervals.length = 0;
        playerIntervals.length = 0;
        gameTimeout = null;
    }
};
