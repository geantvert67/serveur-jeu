class Config {
    constructor(c) {
        this.id = c.id;
        this.name = c.name;
        this.isPrivate = c.isPrivate;
        this.gameMode = c.gameMode;
        this.inventorySize = c.inventorySize;
        this.flagVisibilityRadius = c.flagVisibilityRadius;
        this.flagActionRadius = c.flagActionRadius;
        this.flagCaptureDuration = c.flagCaptureDuration;
        this.launched = false;
    }
}

module.exports = Config;
