const _ = require('lodash'),
    { Interval } = require('../models'),
    { interval_store } = require('../stores');

let idFlagInterval = 1,
    idItemInterval = 1,
    idCapturedFlagInterval = 1,
    idTrapInterval = 1,
    idOtherInterval = 1,
    idPlayerInterval = 1;

const _this = (module.exports = {
    /**
     * Renvoie toutes les intervalles
     */
    getAllIntervals: () => {
        return interval_store.getAllIntervals();
    },

    /**
     * Renvoie tous les timers
     */
    getAllTimers: () => {
        return interval_store.getAllTimers();
    },

    /**
     * Renvoie toutes les intervalles liées au temps de possession d'un cristal
     */
    getAllFlagIntervals: () => {
        return interval_store.getAllFlagIntervals();
    },

    /**
     * Crée une intervalle liée au temps de possession d'un cristal
     *
     * @param object interval Intervalle
     * @param object objectId Identifiant du cristal
     */
    createFlagInterval: (interval, objectId) => {
        interval_store.addFlagInterval(
            new Interval(idFlagInterval, interval, objectId)
        );
        idFlagInterval++;
    },

    /**
     * Supprime une intervalle liée au temps de possession d'un cristal
     *
     * @param object objectId Identifiant du cristal
     */
    removeFlagIntervalByObjectId: objectId => {
        const i = _.find(_this.getAllFlagIntervals(), { objectId });
        if (i) {
            clearInterval(i.interval);
            interval_store.removeFlagInterval(i.id);
        }
    },

    /**
     * Renvoie les timers liés aux items
     */
    getAllItemIntervals: () => {
        return interval_store.getAllItemIntervals();
    },

    /**
     * Crée un timer lié à un item
     *
     * @param object timeout Timer
     * @param object objectId Identifiant de l'item
     */
    createItemInterval: (timeout, objectId) => {
        interval_store.addItemInterval(
            new Interval(idItemInterval, timeout, objectId)
        );
        idItemInterval++;
    },

    /**
     * Supprime un timer lié à un item
     *
     * @param object objectId Identifiant de l'item
     */
    removeItemIntervalByObjectId: objectId => {
        const i = _.find(_this.getAllItemIntervals(), { objectId });
        if (i) {
            clearTimeout(i.interval);
            interval_store.removeItemInterval(i.id);
        }
    },

    /**
     * Renvoie tous les timers liés au temps de d'incapturabilité d'un cristal
     */
    getAllCapturedFlagIntervals: () => {
        return interval_store.getAllCapturedFlagIntervals();
    },

    /**
     * Crée un timer lié au temps de d'incapturabilité d'un cristal
     *
     * @param object timeout Timer
     * @param object objectId Identifiant du cristal
     */
    createCapturedFlagInterval: (timeout, objectId) => {
        interval_store.addCapturedFlagInterval(
            new Interval(idCapturedFlagInterval, timeout, objectId)
        );
        idCapturedFlagInterval++;
    },

    /**
     * Supprime un timer lié au temps de d'incapturabilité d'un cristal
     *
     * @param object objectId Identifiant du cristal
     */
    removeCapturedFlagIntervalByObjectId: objectId => {
        const i = _.find(_this.getAllCapturedFlagIntervals(), { objectId });
        if (i) {
            clearTimeout(i.interval);
            interval_store.removeCapturedFlagInterval(i.id);
        }
    },

    /**
     * Renvoie tous les timers liés aux pièges
     */
    getAllTrapIntervals: () => {
        return interval_store.getAllTrapIntervals();
    },

    /**
     * Crée un timer lié à un piège
     *
     * @param object timeout Timer
     * @param object objectId Identifiant du piège
     */
    createTrapInterval: (timeout, objectId) => {
        interval_store.addTrapInterval(
            new Interval(idTrapInterval, timeout, objectId)
        );
        idTrapInterval++;
    },

    /**
     * Supprime un timer lié à un piège
     *
     * @param object objectId Identifiant du piège
     */
    removeTrapIntervalByObjectId: objectId => {
        const i = _.find(_this.getAllTrapIntervals(), { objectId });
        if (i) {
            clearTimeout(i.interval);
            interval_store.removeTrapInterval(i.id);
        }
    },

    /**
     * Renvoie tous les timers divers
     */
    getAllOtherIntervals: () => {
        return interval_store.getAllOtherIntervals();
    },

    /**
     * Crée un timer divers
     *
     * @param object timeout Timer
     * @param object objectId Identifiant de l'objet lié au timer
     */
    createOtherInterval: (timeout, objectId) => {
        interval_store.addOtherInterval(
            new Interval(idOtherInterval, timeout, objectId)
        );
        idOtherInterval++;
    },

    /**
     * Supprime un timer divers
     *
     * @param object objectId Identifiant de l'objet lié au timer
     */
    removeOtherIntervalById: objectId => {
        const i = _.find(_this.getAllOtherIntervals(), { objectId });
        if (i) {
            clearTimeout(i.interval);
            interval_store.removeOtherInterval(i.id);
        }
    },

    /**
     * Renvoie tous les timers liés aux joueurs
     */
    getAllPlayerIntervals: () => {
        return interval_store.getAllPlayerIntervals();
    },

    /**
     * Crée un timer lié à un joueur
     *
     * @param object timeout Timer
     * @param object objectId Identifiant du joueur
     */
    createPlayerInterval: (timeout, objectId) => {
        interval_store.addPlayerInterval(
            new Interval(idPlayerInterval, timeout, objectId)
        );
        idPlayerInterval++;
    },

    /**
     * Supprime un timer lié à un joueur
     *
     * @param object objectId Identifiant du joueur
     */
    removePlayerIntervalById: objectId => {
        const i = _.find(_this.getAllPlayerIntervals(), { objectId });
        if (i) {
            clearTimeout(i.interval);
            interval_store.removePlayerInterval(i.id);
        }
    },

    /**
     * Crée un timer lié à la partie
     */
    createGameTimeout: (timeout, configId) => {
        interval_store.addGameTimeout(new Interval(1, timeout, configId));
    },

    /**
     * Supprime toutes les intervalles et les timers
     */
    removeAll: () => {
        _this.getAllIntervals().forEach(i => {
            i && clearInterval(i.interval);
        });
        _this.getAllTimers().forEach(i => {
            i && clearTimeout(i.interval);
        });

        interval_store.removeAll();
    }
});
