class Trap {
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
