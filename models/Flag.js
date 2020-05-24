/**
 * Représente un cristal
 */
class Flag {
    /**
     * @param int id Identifiant
     * @param array coordinates Position
     */
    constructor(id, coordinates) {
        this.id = id;
        this.coordinates = coordinates;
        this.team = null;
        this.capturedUntil = null;
        this.hasOracle = false;
        this.nbUpdates = 0;
    }
}

module.exports = Flag;
