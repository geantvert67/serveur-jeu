class ItemInstance {
    constructor(id, i) {
        this.id = id;
        this.name = i.name;
        this.visibilityRadius = i.visibilityRadius;
        this.actionRadius = i.actionRadius;
        this.waitingPeriod = i.waitingPeriod;
        this.autoMove = i.autoMove;
        this.effectDuration = i.effectDuration;
        this.effectStrength = i.effectStrength;
    }
}

module.exports = ItemInstance;
