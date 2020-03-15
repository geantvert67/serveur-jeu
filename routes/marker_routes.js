const { marker_ctrl } = require('../controllers');

module.exports = (io, socket, player) => {
    socket.on('getMarkers', () => {
        socket.emit('getMarkers', marker_ctrl.getAll());
    });

    socket.on('createMarker', ({ coordinates, isPositive }) => {
        marker_ctrl.create(coordinates, isPositive, player.teamId);
    });
};
