const { area_ctrl } = require('../controllers');

module.exports = (io, socket, player) => {
    /**
     * Renvoie les zones interdites et la zone de jeu
     */
    socket.on('getAreas', () => {
        socket.emit('getAreas', area_ctrl.getAll());
    });

    /**
     * Crée une zone
     *
     * @param boolean forbidden Si c'est une zone de jeu ou une zone interdite
     */
    socket.on('createArea', forbidden => {
        area_ctrl.createArea(forbidden);
        io.emit('getAreas', area_ctrl.getAll());
    });

    /**
     * Déplace une zone
     *
     * @param array coordinates Les nouvelles coordonnées de la zone
     * @param int areaId L'identifiant de la zone
     */
    socket.on('moveArea', ({ coordinates, areaId }) => {
        area_ctrl.moveArea(coordinates, areaId);
        io.emit('getAreas', area_ctrl.getAll());
    });

    /**
     * Supprime une zone
     *
     * @param int id L'identifiant de la zone
     */
    socket.on('deleteArea', id => {
        area_ctrl.deleteArea(id);
        io.emit('getAreas', area_ctrl.getAll());
    });

    /**
     * Supprime toutes les zones interdites
     */
    socket.on('deleteForbiddenAreas', () => {
        area_ctrl.deleteForbiddenAreas();
        io.emit('getAreas', area_ctrl.getAll());
    });
};
