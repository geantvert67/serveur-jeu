/**
 * Représente une équipe
 */
class Team {
    /**
     *
     * @param object t Équipe
     */
    constructor(t) {
        this.id = t.id;
        this.name = t.name;
        this.color = t.color;
        this.players = [];
        this.score = 0;
    }
}

module.exports = Team;
