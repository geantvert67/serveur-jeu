const { config_ctrl } = require('../controllers');

module.exports = (io, socket, player) => {
    socket.on('getConfig', () => {
        socket.emit('getConfig', config_ctrl.get());
    });
};
