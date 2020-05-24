const itemModels = [];

/**
 * Gestion des modèles d'items
 */
module.exports = {
    getAll: () => itemModels,
    add: im => itemModels.push(im),
    removeAll: () => (itemModels.length = 0)
};
