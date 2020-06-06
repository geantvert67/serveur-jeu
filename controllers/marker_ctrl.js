const _ = require('lodash'),
    { marker_store } = require('../stores'),
    { Marker } = require('../models'),
    team_ctrl = require('./team_ctrl');

let maxId = 1;

const _this = (module.exports = {
    /**
     * Renvoie tous les points d'intérêt
     */
    getAll: () => {
        return marker_store.getAll();
    },

    /**
     * Renvoie un point d'intérêt à partir d'un identifiant
     *
     * @param int id Identifiant du point d'intérêt
     */
    getById: id => {
        return _.find(_this.getAll(), { id });
    },

    /**
     * Renvoie tous les points d'intérêt d'une équipe
     *
     * @param int teamId Identifiant de l'équipe
     */
    getTeamMarkers: teamId => {
        return _.filter(_this.getAll(), m => m.team.id === teamId);
    },

    /**
     * Crée un point d'intérêt
     *
     * @param array coordinates Position
     * @param boolean isPositive Si c'est un point d'intérêt ou de désintérêt
     * @param int teamId Identifiant de l'équipe
     */
    create: (coordinates, isPositive, teamId) => {
        marker_store.add(
            new Marker(
                maxId,
                coordinates,
                isPositive,
                team_ctrl.getById(teamId)
            )
        );
        maxId++;
    },

    /**
     * Déplace un point d'intérêt
     *
     * @param array coordinates La nouvelle position
     * @param int markerId Identifiant du point d'intérêt
     */
    moveMarker: (coordinates, markerId) => {
        const marker = _this.getById(markerId);
        marker.coordinates = coordinates;
        marker.nbUpdates++;
    },

    /**
     * Supprime un point d'intérêt
     *
     * @param int id Identifiant du point d'intérêt
     */
    delete: id => {
        marker_store.remove(id);
    }
});
