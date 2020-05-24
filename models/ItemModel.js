/**
 * Représente un modèle d'item
 */
class ItemModel {
    /**
     * @param object im Modèle d'item
     */
    constructor(im) {
        this.id = im.id;
        this.name = im.name;
        this.visibilityRadius = im.visibilityRadius;
        this.actionRadius = im.actionRadius;
        this.waitingPeriod = im.waitingPeriod;
        this.autoMove = im.autoMove;
        this.effectDuration = im.effectDuration;
        this.effectStrength = im.effectStrength;
    }
}

module.exports = ItemModel;
