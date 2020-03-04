const { player_store } = require('../stores'),
    { Player } = require('../models');

module.exports = {
    create: username => {
        player_store.add(new Player(username));
    },

    destroy: username => {
        player_store.remove(username);
    }
};
