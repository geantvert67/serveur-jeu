const _ = require('lodash'),
    geolib = require('geolib'),
    moment = require('moment'),
    area_ctrl = require('./area_ctrl'),
    team_ctrl = require('./team_ctrl'),
    game_ctrl = require('./game_ctrl'),
    config_ctrl = require('./config_ctrl'),
    interval_ctrl = require('./interval_ctrl'),
    { flag_store } = require('../stores'),
    { Flag } = require('../models'),
    { getRandomFlagPoint, calculateRadius } = require('../utils');

let maxId = null;

const _this = (module.exports = {
    /**
     * Renvoie tous les cristaux
     */
    getAll: () => {
        return flag_store.getAll();
    },

    /**
     * Renvoie tous les cristaux capturés
     */
    getCaptured: () => {
        return _.filter(_this.getAll(), f => f.team !== null);
    },

    /**
     * Renvoie les cristaux d'un joueur ayant utilisé des antennes
     */
    getFromPlayer: player => {
        return player.antenneFlagsId
            .map(id => _this.getById(id))
            .filter(f => f !== undefined);
    },

    /**
     * Renvoie un cristal à partir d'un identifiant
     *
     * @param int id Identifiant
     */
    getById: id => {
        return _.find(_this.getAll(), { id });
    },

    /**
     * Renvoie les cristaux dans un rayon donné à partir d'une position
     *
     * @param array coordinates Position
     * @param float radius Rayon
     * @param array inActionRadius Cristaux à ne pas renvoyer
     * @param array radiusChange Liste des impacts sur le rayon
     */
    getInRadius: (
        coordinates,
        radius,
        inActionRadius = [],
        radiusChange = []
    ) => {
        return _this.getAll().filter(
            f =>
                !_.some(_this.getCaptured(), f) &&
                !_.some(inActionRadius, f) &&
                geolib.isPointWithinRadius(
                    {
                        latitude: coordinates[0],
                        longitude: coordinates[1]
                    },
                    {
                        latitude: f.coordinates[0],
                        longitude: f.coordinates[1]
                    },
                    calculateRadius(radius, radiusChange)
                )
        );
    },

    /**
     * Renvoie un identifiant pour créer un cristal
     */
    getMaxId: () => {
        if (maxId) {
            maxId++;
            return maxId;
        } else {
            const flag = _.maxBy(_this.getAll(), 'id');
            return flag ? flag.id + 1 : 1;
        }
    },

    /**
     * Crée un cristal
     *
     * @param array coordinates Position
     */
    createFlag: coordinates => {
        const flag = new Flag(_this.getMaxId(), coordinates);
        flag_store.add(flag);
        return flag;
    },

    /**
     * Crée des cristaux aléatoirement
     *
     * @param int nbFlags Le nombre de cristaux à créer
     */
    createRandom: nbFlags => {
        const flags = _this.getAll();
        let nbMax = nbFlags;
        let nbCreated = 0;

        while (nbCreated < nbMax) {
            const coordinates = getRandomFlagPoint(
                area_ctrl.getGameArea(),
                area_ctrl.getForbiddenAreas(),
                flags,
                0,
                100
            );

            if (coordinates) {
                _this.createFlag(coordinates);
                nbCreated++;
            } else {
                nbMax--;
            }
        }

        return nbCreated;
    },

    /**
     * Capture un cristal
     *
     * @param object io Objet Socket.io
     * @param int flagId Identifiant du cristal
     * @param int teamId Identifiant de l'équipe qui va le posséder
     * @param object player Joueur capturant le cristal
     */
    captureFlag: (io, flagId, teamId, player) => {
        const nbFlags = _this.getAll().length,
            flag = _this.getById(flagId),
            { flagCaptureDuration, gameMode } = config_ctrl.get();

        if (
            (flag.capturedUntil &&
                moment().isSameOrAfter(flag.capturedUntil)) ||
            !flag.capturedUntil ||
            !player
        ) {
            if (!flag.team || (flag.team && flag.team.id !== teamId)) {
                const newTeam = team_ctrl.getById(teamId);

                if (flag.team) {
                    const currentTeam = team_ctrl.getById(flag.team.id);
                    if (gameMode === 'TIME') {
                        interval_ctrl.removeFlagIntervalByObjectId(flag.id);
                    } else {
                        currentTeam.score--;
                    }
                } else {
                    player && player.statistics.nbDiscoveredFlags++;
                }

                if (gameMode === 'TIME') {
                    const interval = setInterval(() => {
                        player && player.statistics.score++;
                        newTeam.score++;
                    }, 1000);
                    interval_ctrl.createFlagInterval(interval, flag.id);
                } else {
                    newTeam.score++;
                    player && player.statistics.score++;
                }
                flag.team = newTeam;
                player && player.statistics.nbFlags++;

                if (gameMode === 'SUPREMACY') {
                    if (newTeam.score > nbFlags / 2) {
                        game_ctrl.end(io);
                    }
                }

                _this.setFlagCapturedDuration(flag, flagCaptureDuration);
            }
        }
    },

    /**
     * Modifie le temps d'incapturabilité d'un cristal
     *
     * @param object flag Cristal
     * @param int duration Durée d'incapturabilité
     */
    setFlagCapturedDuration: (flag, duration) => {
        flag.capturedUntil = moment().add(duration, 's');
        flag.nbUpdates++;
        const timer = setTimeout(() => {
            flag.capturedUntil = null;
            flag.nbUpdates++;
            interval_ctrl.removeCapturedFlagIntervalByObjectId(flag.id);
        }, duration * 1000);
        interval_ctrl.createCapturedFlagInterval(timer, flag.id);
    },

    /**
     * Décapture un cristal
     *
     * @param int flagId Identifiant du cristal
     */
    resetFlag: flagId => {
        const flag = _this.getById(flagId),
            { gameMode } = config_ctrl.get();

        if (flag.team) {
            const currentTeam = team_ctrl.getById(flag.team.id);
            if (gameMode === 'TIME') {
                interval_ctrl.removeFlagIntervalByObjectId(flagId);
            } else {
                currentTeam.score--;
            }
        }

        flag.team = null;
        flag.capturedUntil = null;
        flag.hasOracle = false;
        flag.nbUpdates++;
        interval_ctrl.removeCapturedFlagIntervalByObjectId(flagId);
    },

    /**
     * Déplace un cristal
     *
     * @param array coordinates Les nouvelles coordonnées du cristal
     * @param int flagId Identifiant du cristal
     */
    moveFlag: (coordinates, flagId) => {
        const flag = _this.getById(flagId);
        flag.coordinates = coordinates;
        flag.nbUpdates++;
    },

    /**
     * Supprime un cristal
     *
     * @param int id Identifiant du cristal
     */
    delete: id => {
        const flag = _this.getById(id),
            { gameMode } = config_ctrl.get();

        if (flag && flag.team) {
            if (gameMode === 'TIME') {
                interval_ctrl.removeFlagIntervalByObjectId(id);
            } else {
                flag.team.score--;
            }
        }

        flag_store.remove(id);
        interval_ctrl.removeCapturedFlagIntervalByObjectId(id);
    },

    /**
     * Supprime tous les cristaux
     */
    deleteAll: () => {
        flag_store.removeAll();
    },

    /**
     * Modifie aléatoirement la position de tous les cristaux
     */
    randomize: () => {
        const flags = _this.getAll();

        flags.forEach(f => {
            f.coordinates = getRandomFlagPoint(
                area_ctrl.getGameArea(),
                area_ctrl.getForbiddenAreas(),
                flags.filter(flag => flag.id !== f.id)
            );
            f.nbUpdates++;
        });
    }
});
