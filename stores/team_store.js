const _ = require('lodash'),
    teams = [];

module.exports = {
    getAll: () => teams,
    add: t => teams.push(t),
    remove: id => _.remove(teams, t => t.id === id),
    removeAll: () => (teams.length = 0)
};
