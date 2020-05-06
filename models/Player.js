class Player {
    constructor(username, isConnected) {
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
        this.score = 0;
    }
}

module.exports = Player;
