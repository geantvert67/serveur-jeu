/**
 * Représente les statistiques d'un joueur
 */
class Statistics {
    constructor() {
        this.score = 0;
        this.nbFlags = 0;
        this.nbDiscoveredFlags = 0;
        this.nbTraps = 0;
        this.hasWon = null;
        this.hasLost = null;
        this.teamName = null;
        this.teamColor = null;
        this.teamScore = 0;
    }
}

module.exports = Statistics;
