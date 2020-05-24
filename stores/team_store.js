const _ = require('lodash'),
    teams = [];

/**
 * Gestion des équipes
 */
module.exports = {
    getAll: () => teams,
    add: t => teams.push(t),
    remove: id => _.remove(teams, t => t.id === id),
    removeAll: () => (teams.length = 0)
};
