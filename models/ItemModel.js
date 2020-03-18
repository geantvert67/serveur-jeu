class ItemModel {
    constructor(im) {
        this.id = im.id;
        this.name = im.name;
        this.visibilityRadius = im.visibilityRadius;
        this.actionRadius = im.actionRadius;
        this.waitingPeriod = im.waitingPeriod;
        this.autoMove = im.autoMove;
    }
}

module.exports = ItemModel;
