const _ = require('lodash/array');

const players = [];

module.exports = {
    getAll: () => players,
    add: p => players.push(p),
    remove: username => _.remove(players, p => p.username === username)
};
