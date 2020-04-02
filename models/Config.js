class Config {
    constructor(c) {
        this.id = c.id;
        this.name = c.name;
        this.isPrivate = c.isPrivate;
        this.gameMode = c.gameMode;
        this.inventorySize = c.inventorySize;
        this.maxPlayers = c.maxPlayers;
        this.flagVisibilityRadius = c.flagVisibilityRadius;
        this.flagActionRadius = c.flagActionRadius;
        this.playerVisibilityRadius = c.playerVisibilityRadius;
        this.playerActionRadius = c.playerActionRadius;
        this.flagCaptureDuration = c.flagCaptureDuration;
        this.launched = false;
        this.willLaunchAt = null;
        this.published = false;
    }
}

module.exports = Config;
