const players = [];

module.exports = {
    getAll: () => players,
    add: p => players.push(p)
};
