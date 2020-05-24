const { trap_ctrl } = require('../controllers');

module.exports = (io, socket, player) => {
    /**
     * Déplace un piège
     *
     * @param array coordinates Position
     * @param int trapId Identifiant du piège
     */
    socket.on('moveTrap', ({ coordinates, trapId }) => {
        trap_ctrl.moveTrap(coordinates, trapId);
    });

    /**
     * Supprime un piège
     *
     * @param int id Identifiant du piège
     */
    socket.on('deleteTrap', id => {
        trap_ctrl.delete(id);
    });
};
