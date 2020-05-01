class Flag {
    constructor(f) {
        this.id = f.id;
        this.coordinates = f.position.coordinates;
        this.team = null;
        this.capturedUntil = null;
        this.hasOracle = false;
        this.nbUpdates = 0;
    }
}

module.exports = Flag;
