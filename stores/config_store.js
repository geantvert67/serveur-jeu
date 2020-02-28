let config = {};

module.exports = {
    get: () => config,
    set: c => (config = c)
};
