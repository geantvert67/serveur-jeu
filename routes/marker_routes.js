const { marker_ctrl } = require('../controllers');

module.exports = (io, socket, player) => {
    /**
     * Récupère les points d'intérêts
     */
    socket.on('getMarkers', () => {
        socket.emit('getMarkers', marker_ctrl.getAll());
    });

    /**
     * Crée un point d'intérêt
     *
     * @param array coordinates Position
     * @param boolean isPositive Si c'est un point d'intérêt ou de désintérêt
     */
    socket.on('createMarker', ({ coordinates, isPositive }) => {
        marker_ctrl.create(coordinates, isPositive, player.teamId);
    });

    /**
     * Déplace un point d'intérêt
     *
     * @param array coordinates La nouvelle position
     * @param int markerId Identifiant du point d'intérêt
     */
    socket.on('moveMarker', ({ coordinates, markerId }) => {
        marker_ctrl.moveMarker(coordinates, markerId);
    });

    /**
     * Supprime un point d'intérêt
     *
     * @param int id Identifiant du point d'intérêt
     */
    socket.on('deleteMarker', id => {
        marker_ctrl.delete(id);
    });
};
