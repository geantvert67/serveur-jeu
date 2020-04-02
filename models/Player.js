class Player {
    constructor(username, isConnected) {
        this.username = username;
        this.coordinates = [];
        this.isConnected = isConnected;
        this.nbCapturedFlags = 0;
    }
}

module.exports = Player;
