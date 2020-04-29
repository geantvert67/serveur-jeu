const itemModels = [];

module.exports = {
    getAll: () => itemModels,
    add: im => itemModels.push(im),
    removeAll: () => (itemModels.length = 0)
};
