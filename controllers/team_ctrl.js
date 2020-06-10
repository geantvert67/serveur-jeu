const _ = require('lodash'),
    { team_store } = require('../stores'),
    config_ctrl = require('./config_ctrl');

const _this = (module.exports = {
    /**
     * Renvoie toutes les équipes
     */
    getAll: () => {
        return team_store.getAll();
    },

    /**
     * Renvoie les identifiants de toutes les équipes
     */
    getAllIds: () => {
        return _this.getAll().map(t => t.id);
    },

    /**
     * Renvoie une équipe à partir d'un identifiant
     *
     * @param int id Identifiant de l'équipe
     */
    getById: id => {
        return _.find(team_store.getAll(), { id });
    },

    /**
     * Renvoie tous les joueurs ayant une équipe
     */
    getPlayers: () => {
        const players = [];
        _this.getAll().map(t => t.players.map(p => players.push(p)));
        return players;
    },

    /**
     * Renvoie tous les joueurs ne faisant pas partie d'une équipe
     *
     * @param int teamId Identifiant de l'équipe
     */
    getEnnemis: teamId => {
        const ennemis = [];
        _this
            .getAll()
            .filter(t => t.id !== teamId)
            .forEach(t => t.players.forEach(p => ennemis.push(p)));
        return ennemis;
    },

    /**
     * Renvoie tous les joueurs faisant partie d'une équipe
     *
     * @param int teamId Identifiant de l'équipe
     */
    getTeamPlayers: teamId => {
        return _this.getById(teamId).players;
    },

    /**
     * Ajoute un joueur dans une équipe
     *
     * @param int teamId Identifiant de l'équipe
     * @param object player Joueur
     */
    addPlayer: (teamId, player) => {
        const players = _this.getPlayers();
        const team = _this.getById(teamId);
        const { maxPlayers } = config_ctrl.get();

        if (
            !config_ctrl.isLaunched() &&
            (team.players.length < maxPlayers || !maxPlayers) &&
            !_.find(players, { username: player.username })
        ) {
            player.teamId = teamId;
            player.teamColor = team.color;
            team.players.push(player);
            return true;
        }
        return false;
    },

    /**
     * Renvoie l'équipe ayant le moins de joueurs
     */
    findByMinPlayers: () => {
        return _.minBy(team_store.getAll(), t => t.players.length);
    },

    /**
     * Renvoie l'équipe possédant un certain joueur
     *
     * @param string username Nom d'utilisateur du joueur
     */
    findByPlayer: username => {
        let team = null;

        _this.getAll().map(t => {
            if (_.some(t.players, { username })) {
                team = t;
            }
        });
        return team;
    },

    /**
     * Supprime une équipe
     *
     * @param int teamId Identifiant de l'équipe
     */
    delete: id => {
        team_store.remove(id);
    }
});
