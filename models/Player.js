class Player {
    constructor(username, isConnected) {
        this.username = username;
        this.coordinates = [];
        this.inventory = [];
        this.isConnected = isConnected;
        this.score = 0;
    }
}

module.exports = Player;
