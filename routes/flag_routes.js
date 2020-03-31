const { flag_ctrl } = require('../controllers');

module.exports = (io, socket, player) => {
    socket.on('getFlags', () => {
        socket.emit('getFlags', flag_ctrl.getAll());
    });

    socket.on('captureFlag', ({ flagId, teamId }) => {
        flag_ctrl.captureFlag(flagId, teamId, player);
    });

    socket.on('moveFlag', ({ coordinates, flagId }) => {
        flag_ctrl.moveFlag(coordinates, flagId);
    });

    socket.on('deleteFlag', id => {
        flag_ctrl.delete(id);
    });
};
