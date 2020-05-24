const { player_ctrl } = require('../controllers');

module.exports = (io, socket, player) => {
    /**
     * Récupère un joueur à partir d'un nom d'utilsateur
     *
     * @param string username Le nom d'utilisateur
     */
    socket.on('getPlayerByUsername', username => {
        socket.emit('getPlayer', player_ctrl.getByUsername(username));
    });
};
