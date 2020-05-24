const { item_ctrl } = require('../controllers');

module.exports = (io, socket, player) => {
    /**
     * Récupère les items
     */
    socket.on('getItems', () => {
        socket.emit('getItems', item_ctrl.getAll());
    });

    /**
     * Ramasse un item
     *
     * @param int id Identifiant de l'item
     */
    socket.on('takeItem', id => {
        if (!player || (player && !player.immobilizedUntil)) {
            item_ctrl.takeItem(player, id);
        }
    });

    /**
     * Dépose un item
     *
     * @param int id Identifiant de l'item
     * @param array coordinates Position où déposer l'item
     */
    socket.on('dropItem', ({ id, coordinates }) => {
        item_ctrl.dropItem(player, id, coordinates);
    });

    /**
     * Crée un item
     *
     * @param array coordinates Position
     * @param string name Nom du modèle d'item
     * @param function onSuccess Fonction de callback
     */
    socket.on('createItem', ({ coordinates, name }, onSuccess) => {
        const item = item_ctrl.createItem(coordinates, name);
        if (item) onSuccess(item);
    });

    /**
     * Crée des items aléatoirement
     *
     * @param int nbItems Le nombre d'items à créer
     * @param string name Nom du modèle d'item
     */
    socket.on('createRandomItems', ({ nbItems, name }) => {
        item_ctrl.createRandom(nbItems, name);
    });

    /**
     * Modifie les paramètres d'un item
     *
     * @param int id Identifiant de l'item
     * @param object newItem Les nouveaux paramètres de l'item
     */
    socket.on('updateItem', ({ id, newItem }) => {
        item_ctrl.update(id, newItem);
    });

    /**
     * Déplace un item
     *
     * @param array coordinates Nouvelle position
     * @param int flagId Identifiant de l'item
     */
    socket.on('moveItem', ({ coordinates, itemId }) => {
        item_ctrl.moveItem(coordinates, itemId);
    });

    /**
     * Supprime un item
     *
     * @param int id Identifiant de l'item
     */
    socket.on('deleteItem', id => {
        item_ctrl.delete(id);
    });

    /**
     * Supprime tous les items d'un certain nom
     *
     * @param string name Nom du modèle d'item
     */
    socket.on('deleteItemsByName', name => {
        item_ctrl.deleteByName(name);
    });
};
