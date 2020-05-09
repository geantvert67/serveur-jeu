class Player {
    constructor(id, username, isConnected) {
        this.id = id;
        this.username = username;
        this.coordinates = [];
        this.inventory = [];
        this.isConnected = isConnected;
        this.hasTransporteur = false;
        this.immobilizedUntil = null;
        this.antenneFlagsId = [];
        this.visibilityChange = [];
        this.noyaux = [];
        this.nbUpdates = 0;
        this.statistics = null;
    }
}

module.exports = Player;
