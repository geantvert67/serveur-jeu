class Trap {
    constructor(id, i, coordinates) {
        this.id = id;
        this.name = i.name;
        this.visibilityRadius = i.visibilityRadius;
        this.actionRadius = i.actionRadius;
        this.effectDuration = i.effectDuration;
        this.coordinates = coordinates;
        this.active = false;
    }
}

module.exports = Trap;
