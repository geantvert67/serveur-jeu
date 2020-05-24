/**
 * Représente un point d'intérêt
 */
class Marker {
    /**
     * @param int id Identifiant
     * @param array coordinates Position
     * @param boolean isPositive Si c'est un point d'intérêt ou de désintérêt
     * @param object team Équipe qui a posé le point d'intérêt
     */
    constructor(id, coordinates, isPositive, team) {
        this.id = id;
        this.coordinates = coordinates;
        this.isPositive = isPositive;
        this.team = team;
        this.nbUpdates = 0;
    }
}

module.exports = Marker;
