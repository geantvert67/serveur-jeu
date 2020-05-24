const _ = require('lodash'),
    { item_model_store } = require('../stores');

const _this = (module.exports = {
    /**
     * Renvoie tous les modèles d'items
     */
    getAll: () => {
        return item_model_store.getAll();
    },

    /**
     * Renvoie un modèle d'item à partir d'un identifiant
     *
     * @param int id Identifiant du modèle d'item
     */
    getById: id => {
        return _.find(_this.getAll(), { id });
    },

    /**
     * Renvoie un modèle d'item à partir d'un nom
     *
     * @param string name Nom du modèle d'item
     */
    getByName: name => {
        return _.find(_this.getAll(), { name });
    },

    /**
     * Modifie les paramètres d'un modèle d'item
     *
     * @param int id Identifiant du modèle d'item
     * @param object newItem Les nouveaux paramètres du modèle d'item
     */
    update: (id, newItem) => {
        let item = _this.getById(id);
        Object.keys(newItem)
            .filter(e => newItem[e])
            .forEach(e => (item[e] = newItem[e]));
    }
});
