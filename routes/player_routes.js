const { player_ctrl } = require('../controllers');

module.exports = (io, socket, player) => {
    socket.on('getPlayerByUsername', username => {
        socket.emit('getPlayer', player_ctrl.getByUsername(username));
    });
};
