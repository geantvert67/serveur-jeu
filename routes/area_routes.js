const { area_ctrl } = require('../controllers');

module.exports = (io, socket, player) => {
    socket.on('getAreas', () => {
        socket.emit('getAreas', area_ctrl.getAll());
    });

    socket.on('createArea', forbidden => {
        area_ctrl.createArea(forbidden);
        io.emit('getAreas', area_ctrl.getAll());
    });

    socket.on('moveArea', ({ coordinates, areaId }) => {
        area_ctrl.moveArea(coordinates, areaId);
        io.emit('getAreas', area_ctrl.getAll());
    });

    socket.on('deleteArea', id => {
        area_ctrl.deleteArea(id);
        io.emit('getAreas', area_ctrl.getAll());
    });

    socket.on('deleteForbiddenAreas', () => {
        area_ctrl.deleteForbiddenAreas();
        io.emit('getAreas', area_ctrl.getAll());
    });
};
