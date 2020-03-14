const { config_ctrl } = require('../controllers');

module.exports = (io, socket, player) => {
    socket.on('getConfig', () => {
        socket.emit('getConfig', config_ctrl.get());
    });

    socket.on('launchGame', () => {
        config_ctrl
            .launch()
            .then(() => io.emit('getConfig', config_ctrl.get()));
    });
};
