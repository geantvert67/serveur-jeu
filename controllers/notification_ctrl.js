const team_ctrl = require('./team_ctrl'),
    { Notification } = require('../models');

const _this = (module.exports = {
    /**
     * Crée une notification pour une équipe
     *
     * @param string message Message à envoyer
     * @param array ids Identifiant de chaque destinataire
     */
    notifyTeam: (message, ids) => {
        return new Notification(message, 'team', ids);
    },

    /**
     * Crée une notification pour un utilisateur
     *
     * @param string message Message à envoyer
     * @param array ids Identifiant de chaque destinataire
     */
    notifyUser: (message, ids) => {
        return new Notification(message, 'user', ids);
    },

    /**
     * Envoie des notifications liées à la capture d'un cristal
     *
     * @param object io Object Socket.io
     * @param int teamId Identifiant de l'équipe ayant capturé le cristal
     */
    captureFlag: (io, teamId) => {
        const team = team_ctrl.getById(teamId);
        const teamIds = team_ctrl.getAllIds().filter(t => t != teamId);
        const notifications = [];

        notifications.push(
            _this.notifyTeam('Votre équipe a capturé un cristal', [teamId])
        );
        notifications.push(
            _this.notifyTeam(`${team.name} a capturé un cristal`, teamIds)
        );

        io.emit('getNotification', notifications);
    },

    /**
     * Envoie des notifications liées à la création d'un point d'intérêt
     *
     * @param object io Object Socket.io
     * @param boolean isPositive Si c'est un point d'intérêt ou de désintérêt
     * @param string username Nom d'utilisateur du joueur ayant créé le point d'intérêt
     * @param int teamId Identifiant de l'équipe ayant créé le point d'intérêt
     */
    createMarker: (io, isPositive, username, teamId) => {
        const notification = _this.notifyTeam(
            `${username} a posé un point ${
                isPositive ? "d'intérêt" : 'de désintérêt'
            }`,
            [teamId]
        );
        io.emit('getNotification', [notification]);
    },

    /**
     * Envoie des notifications liées à l'utilisation d'une tempête ou d'un disloqueur
     *
     * @param object io Object Socket.io
     * @param string name Nom de l'item
     * @param string username Nom d'utilisateur du joueur ayant utilisé l'item
     */
    useItem: (io, name, username) => {
        const notification = _this.notifyTeam(
            `${username} a utilisé ${name}`,
            team_ctrl.getAllIds()
        );
        io.emit('getNotification', [notification]);
    },

    /**
     * Envoie des notifications liées à l'utilisation d'un intercepteur
     *
     * @param object io Object Socket.io
     * @param string username Nom d'utilisateur du joueur ayant utilisé l'item
     * @param int teamId Identifiant de l'équipe ayant utilisé l'item
     */
    useIntercepteur: (io, username, teamId) => {
        const teamIds = team_ctrl.getAllIds().filter(t => t != teamId);
        const notifications = [];

        notifications.push(
            _this.notifyTeam(
                `${username} brouille votre vision avec un intercepteur`,
                teamIds
            )
        );
        notifications.push(
            _this.notifyTeam(
                `${username} brouille la vision des ennemis avec un intercepteur`,
                [teamId]
            )
        );

        io.emit('getNotification', notifications);
    },

    /**
     * Envoie des notifications liées à l'utilisation d'un portail
     *
     * @param object io Object Socket.io
     * @param string username Nom d'utilisateur du joueur ayant utilisé l'item
     * @param string name Nom de l'item donné
     * @param int userId Identifiant de l'utilisateur ayant reçu l'item
     */
    usePortail: (io, username, name, userId) => {
        const notification = _this.notifyUser(
            `${username} vous a donné un(e) ${name}`,
            [userId]
        );
        io.emit('getNotification', [notification]);
    },

    /**
     * Envoie des notifications liées à l'utilisation d'une sentinelle ou d'un oracle
     *
     * @param object io Object Socket.io
     * @param string name Nom de l'item
     * @param int teamId Identifiant de l'équipe ayant utilisé l'item
     */
    useFlagItem: (io, name, teamId) => {
        const notification = _this.notifyTeam(
            `Un de vos cristaux est désormais protégé par ${name}`,
            [teamId]
        );
        io.emit('getNotification', [notification]);
    },

    /**
     * Envoie des notifications liées à l'utilisation d'un canon
     *
     * @param object io Object Socket.io
     * @param object target Joueur qui s'est pris le piège
     * @param object owner Joueur qui a posé le piège
     * @param int teamId Identifiant de l'équipe du joueur qui s'est pris le piège
     */
    canonEffect: (io, target, owner, teamId) => {
        const notifications = [];

        notifications.push(
            _this.notifyUser(
                `Vous êtes paralysé par un canon à photons de ${owner.username}`,
                [target.id]
            )
        );
        notifications.push(
            _this.notifyTeam(
                `${target.username} est paralysé par un canon à photons de ${owner.username}`,
                [teamId]
            )
        );
        notifications.push(
            _this.notifyUser(
                `${target.username} est paralysé par votre canon à photons`,
                [owner.id]
            )
        );

        io.emit('getNotification', notifications);
    },

    /**
     * Envoie des notifications liées à l'utilisation d'un transducteur
     *
     * @param object io Object Socket.io
     * @param string name Nom de l'item volé
     * @param object target Joueur qui s'est pris le piège
     * @param object owner Joueur qui a posé le piège
     * @param int teamId Identifiant de l'équipe du joueur qui s'est pris le piège
     */
    transducteurEffect: (io, name, target, owner, teamId) => {
        const notifications = [];

        notifications.push(
            _this.notifyUser(`${owner.username} vous a volé un(e) ${name}`, [
                target.id
            ])
        );
        notifications.push(
            _this.notifyTeam(
                `${target.username} s'est fait volé un(e) ${name} par ${owner.username}`,
                [teamId]
            )
        );
        notifications.push(
            _this.notifyUser(
                `Vous avez volé un(e) ${name} à ${target.username}`,
                [owner.id]
            )
        );

        io.emit('getNotification', notifications);
    }
});
