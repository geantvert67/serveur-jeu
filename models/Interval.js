/**
 * Représente une intervalle ou un timer
 */
class Interval {
    /**
     * @param int id Identifiant
     * @param object interval Intervalle ou timer
     * @param int objectId Identifiant de l'objet sur lequel l'intervalle ou le
     * timer s'applique
     */
    constructor(id, interval, objectId) {
        this.id = id;
        this.interval = interval;
        this.objectId = objectId;
    }
}

module.exports = Interval;
