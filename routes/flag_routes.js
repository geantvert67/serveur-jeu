const { flag_ctrl } = require('../controllers');

module.exports = (io, socket, player) => {
    socket.on('getFlags', () => {
        socket.emit('getFlags', flag_ctrl.getAll());
    });

    socket.on('createFlag', coordinates => {
        flag_ctrl.createFlag(coordinates);
    });

    socket.on('captureFlag', ({ flagId, teamId }) => {
        if (!player || (player && !player.immobilized)) {
            flag_ctrl.captureFlag(io, flagId, teamId, player);
        }
    });

    socket.on('resetFlag', flagId => {
        flag_ctrl.resetFlag(flagId);
    });

    socket.on('moveFlag', ({ coordinates, flagId }) => {
        flag_ctrl.moveFlag(coordinates, flagId);
    });

    socket.on('deleteFlag', id => {
        flag_ctrl.delete(id);
    });

    socket.on('deleteAllFlags', () => {
        flag_ctrl.deleteAll();
    });
};
