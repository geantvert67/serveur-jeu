const teams = [];

module.exports = {
    getAll: () => teams,
    add: t => teams.push(t)
};
