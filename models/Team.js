class Team {
    constructor(t) {
        this.id = t.id;
        this.name = t.name;
        this.color = t.color;
        this.players = [];
        this.nbFlags = 0;
    }
}

module.exports = Team;
