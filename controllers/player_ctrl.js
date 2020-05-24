const _ = require('lodash'),
    geolib = require('geolib'),
    { player_store } = require('../stores'),
    { Player, Statistics } = require('../models'),
    config_ctrl = require('./config_ctrl'),
    { calculateRadius } = require('../utils');

const _this = (module.exports = {
    /**
     * Renvoie tous les joueurs
     */
    getAll: () => {
        return player_store.getAll();
    },

    /**
     * Renvoie un joueur à partir d'un nom d'utilisateur
     *
     * @param string username Nom d'utilisateur du joueur
     */
    getByUsername: username => {
        return _.find(_this.getAll(), { username });
    },

    /**
     * Renvoie un joueur à partir d'un nom d'utilisateur, en le crée s'il n'existe
     * pas encore
     *
     * @param int id Identifiant du joueur
     * @param string username Nom d'utilisateur du joueur
     * @param boolean isConnected Si le joueur est connecté à la partie
     */
    getOrCreate: (id, username, isConnected) => {
        if (!username || !id) return null;

        const player = new Player(id, username, isConnected),
            p = _.find(_this.getAll(), { username });

        if (!p) {
            if (!config_ctrl.isLaunched()) {
                player.statistics = new Statistics();
                player_store.add(player);
                return player;
            }
            return null;
        }

        p.isConnected = true;
        return p;
    },

    /**
     * Renvoie les joueurs ennemis dans un rayon donné à partir d'une position
     *
     * @param array coordinates Position
     * @param int teamId Identifiant de l'équipe du joueur
     * @param float radius Rayon
     * @param array inActionRadius Joueurs à ne pas renvoyer
     * @param array radiusChange Liste des impacts sur le rayon
     */
    getInRadius: (
        coordinates,
        teamId,
        radius,
        inActionRadius = [],
        radiusChange = []
    ) => {
        return _this.getAll().filter(
            p =>
                !_.some(inActionRadius, p) &&
                p.teamId !== teamId &&
                p.coordinates.length > 0 &&
                geolib.isPointWithinRadius(
                    {
                        latitude: coordinates[0],
                        longitude: coordinates[1]
                    },
                    {
                        latitude: p.coordinates[0],
                        longitude: p.coordinates[1]
                    },
                    calculateRadius(radius, radiusChange)
                )
        );
    }
});
