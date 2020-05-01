class Item {
    constructor(i) {
        this.id = i.id;
        this.quantity = i.quantity;
        this.coordinates = i.position.coordinates;
        this.name = i.name;
        this.visibilityRadius = i.visibilityRadius;
        this.actionRadius = i.actionRadius;
        this.waitingPeriod = i.waitingPeriod;
        this.autoMove = i.autoMove;
        this.effectDuration = i.effectDuration;
        this.effectStrength = i.effectStrength;
        this.waitingUntil = null;
        this.nbUpdates = 0;
    }
}

module.exports = Item;
