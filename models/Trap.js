/**
 * Représente un piège
 */
class Trap {
    /**
     *
     * @param int id Identifiant
     * @param object i Item
     * @param object player Joueur ayant installé le piège
     * @param array coordinates Position
     */
    constructor(id, i, player, coordinates) {
        this.id = id;
        this.name = i.name;
        this.visibilityRadius = i.visibilityRadius;
        this.actionRadius = i.actionRadius;
        this.effectDuration = i.effectDuration;
        this.owner = player;
        this.coordinates = coordinates;
        this.inactiveUntil = null;
        this.nbUpdates = 0;
    }
}

module.exports = Trap;
