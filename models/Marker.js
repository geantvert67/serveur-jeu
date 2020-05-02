class Marker {
    constructor(id, coordinates, isPositive, team) {
        this.id = id;
        this.coordinates = coordinates;
        this.isPositive = isPositive;
        this.team = team;
        this.nbUpdates = 0;
    }
}

module.exports = Marker;
