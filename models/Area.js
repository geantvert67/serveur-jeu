class Area {
    constructor(a) {
        this.id = a.id;
        this.coordinates = a.position.coordinates;
        this.forbidden = a.forbidden;
    }
}

module.exports = Area;
