/**
 * Représente la partie
 */
class Game {
    /**
     * @param object g Partie
     */
    constructor(g) {
        this.id = g.id;
        this.ip = g.ip;
        this.port = g.port;
    }
}

module.exports = Game;
