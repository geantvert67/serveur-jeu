/**
 * Représente un item dans l'inventaire
 */
class ItemInstance {
    /**
     * @param int id Idetifiant
     * @param object i Item
     */
    constructor(id, i) {
        this.id = id;
        this.name = i.name;
        this.visibilityRadius = i.visibilityRadius;
        this.actionRadius = i.actionRadius;
        this.waitingPeriod = i.waitingPeriod;
        this.autoMove = i.autoMove;
        this.effectDuration = i.effectDuration;
        this.effectStrength = i.effectStrength;
        this.equiped = false;
        this.nbUpdates = 0;
    }
}

module.exports = ItemInstance;
