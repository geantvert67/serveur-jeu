const itemModels = [];

module.exports = {
    getAll: () => itemModels,
    add: im => itemModels.push(im)
};
