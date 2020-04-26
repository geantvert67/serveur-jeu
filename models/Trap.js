class Trap {
    constructor(id, i, player, coordinates) {
        this.id = id;
        this.name = i.name;
        this.visibilityRadius = i.visibilityRadius;
        this.actionRadius = i.actionRadius;
        this.effectDuration = i.effectDuration;
        this.itemInstanceId = i.id;
        this.owner = player;
        this.coordinates = coordinates;
        this.active = false;
    }
}

module.exports = Trap;
