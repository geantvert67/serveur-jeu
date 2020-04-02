const { area_ctrl } = require('../controllers');

module.exports = (io, socket, player) => {
    socket.on('getAreas', () => {
        socket.emit('getAreas', area_ctrl.getAll());
    });

    socket.on('moveArea', ({ coordinates, areaId }) => {
        area_ctrl.moveArea(coordinates, areaId);
        io.emit('getAreas', area_ctrl.getAll());
    });
};
