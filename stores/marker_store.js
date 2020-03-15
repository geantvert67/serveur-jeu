const markers = [];

module.exports = {
    getAll: () => markers,
    add: m => markers.push(m)
};
