/**
 * Zone de jeu ou interdite
 */
class Area {
    /**
     * @param int id Identifiant
     * @param array coordinates Position
     * @param boolean forbidden Si c'est une zone interdite ou une zone de jeu
     */
    constructor(id, coordinates, forbidden) {
        this.id = id;
        this.coordinates = coordinates;
        this.forbidden = forbidden;
    }
}

module.exports = Area;
