const _ = require('lodash'),
    { Area } = require('../models'),
    { area_store } = require('../stores');

let id = null;

const _this = (module.exports = {
    /**
     * Renvoie toutes les zones
     */
    getAll: () => {
        return area_store.getAll();
    },

    /**
     * Renvoie une zone à partir d'un identifiant
     *
     * @param int id Identifiant
     */
    getById: id => {
        return _.find(_this.getAll(), { id });
    },

    /**
     * Renvoie la zone de jeu
     */
    getGameArea: () => {
        return _this.getAll().filter(a => !a.forbidden)[0];
    },

    /**
     * Renvoie les zones interdites
     */
    getForbiddenAreas: () => {
        return _this.getAll().filter(a => a.forbidden);
    },

    /**
     * Renvoie un identifiant pour créer une zone
     */
    getMaxId: () => {
        if (id) {
            id++;
            return id;
        } else {
            const area = _.maxBy(_this.getAll(), 'id');
            return area ? area.id + 1 : 1;
        }
    },

    /**
     * Crée une zone
     *
     * @param boolean forbidden Si c'est une zone interdite ou une zone de jeu
     */
    createArea: forbidden => {
        area_store.add(new Area(_this.getMaxId(), [[]], forbidden));
    },

    /**
     * Déplace une zone
     *
     * @param array coordinates Les nouvelles coordonnées de la zone
     * @param int id L'identifiant de la zone
     */
    moveArea: (coordinates, id) => {
        _this.getById(id).coordinates = coordinates;
    },

    /**
     * Supprime une zone
     *
     * @param int id L'identifiant de la zone
     */
    deleteArea: id => {
        area_store.remove(id);
    },

    /**
     * Supprime toutes les zones interdites
     */
    deleteForbiddenAreas: () => {
        _this.getForbiddenAreas().forEach(a => _this.deleteArea(a.id));
    }
});
