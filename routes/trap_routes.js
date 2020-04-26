const { trap_ctrl } = require('../controllers');

module.exports = (io, socket, player) => {
    socket.on('moveTrap', ({ coordinates, trapId }) => {
        trap_ctrl.moveTrap(coordinates, trapId);
    });

    socket.on('deleteTrap', id => {
        trap_ctrl.delete(id);
    });
};
