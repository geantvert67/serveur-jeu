const { config_ctrl } = require('../controllers');

module.exports = (io, socket, player) => {
    socket.on('getConfig', () => {
        socket.emit('getConfig', config_ctrl.get());
    });

    socket.on('launchGame', date => {
        date ? config_ctrl.launchAt(io, date) : config_ctrl.launch(io);
    });
};
