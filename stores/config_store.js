let config = {};

/**
 * Gestion de la configuration
 */
module.exports = {
    get: () => config,
    set: c => (config = c)
};
