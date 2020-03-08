class Config {
    launched = false;

    constructor(c) {
        this.name = c.name;
        this.isPrivate = c.isPrivate;
        this.gameMode = c.gameMode;
        this.inventorySize = c.inventorySize;
        this.flagVisibilityRadius = c.flagVisibilityRadius;
        this.flagActionRadius = c.flagActionRadius;
        this.flagCaptureDuration = c.flagCaptureDuration;
    }
}

module.exports = Config;
