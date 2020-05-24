let game = {};

/**
 * Gestion de la partie
 */
module.exports = {
    get: () => game,
    set: g => (game = g)
};
