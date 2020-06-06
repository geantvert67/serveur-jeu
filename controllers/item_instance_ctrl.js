const _ = require('lodash'),
    { item_instance_store } = require('../stores'),
    { ItemInstance } = require('../models');

let maxId = 1;

const _this = (module.exports = {
    /**
     * Renvoie tous les items dans l'inventaire
     */
    getAll: () => {
        return item_instance_store.getAll();
    },

    /**
     * Renvoie un item dans un inventaire à partir d'un identifiant
     *
     * @param int id Identifiant de l'item dans l'inventaire
     */
    getById: id => {
        return _.find(_this.getAll(), { id });
    },

    /**
     * Crée un item dans l'inventaire
     *
     * @param object item L'item à créer
     */
    create: item => {
        const itemInstance = new ItemInstance(maxId, item);
        item_instance_store.add(itemInstance);
        maxId++;

        return itemInstance;
    },

    /**
     * Enlève un item de l'inventaire d'un joueur
     *
     * @param int id Identifiant de l'item à enlever
     * @param object player Joueur
     */
    removeFromInventory: (id, player) => {
        _.remove(player.inventory, i => i.id === id);
    },

    /**
     * Supprime un item dans l'inventaire
     *
     * @param int id Identifiant de l'item dans l'inventaire
     * @param object player Joueur qui possède cet item
     */
    delete: (id, player = null) => {
        player && _this.removeFromInventory(id, player);
        item_instance_store.remove(id);
    }
});
