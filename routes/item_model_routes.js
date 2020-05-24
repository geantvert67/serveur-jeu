const { item_model_ctrl } = require('../controllers');

module.exports = (io, socket, player) => {
    /**
     * Récupère les modèles d'items
     */
    socket.on('getItemModels', () => {
        socket.emit('getItemModels', item_model_ctrl.getAll());
    });

    /**
     * Modifie les paramètres d'un modèle d'item
     *
     * @param int id Identifiant du modèle d'item
     * @param object newItem Les nouveaux paramètres du modèle d'item
     */
    socket.on('updateItemModel', ({ id, newItem }) => {
        item_model_ctrl.update(id, newItem);
        socket.emit('getItemModels', item_model_ctrl.getAll());
    });
};
