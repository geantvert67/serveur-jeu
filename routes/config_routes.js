const { config_ctrl } = require('../controllers');

module.exports = (io, socket, player) => {
    socket.on('getConfig', () => {
        socket.emit('getConfig', config_ctrl.get());
    });

    socket.on('updateConfig', newConfig => {
        config_ctrl.update(newConfig);
        socket.emit('getConfig', config_ctrl.get());
    });
};
