const areas = [];

module.exports = {
    getAll: () => areas,
    add: a => areas.push(a),
    removeAll: () => (areas.length = 0)
};
