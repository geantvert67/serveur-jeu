const flags = [];

module.exports = {
    getAll: () => flags,
    add: f => flags.push(f)
};
