const players = [];

/**
 * Gestion des joueurs
 */
module.exports = {
    getAll: () => players,
    add: p => players.push(p),
    removeAll: () => (players.length = 0)
};
