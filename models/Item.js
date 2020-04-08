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
    }
}

module.exports = Item;
