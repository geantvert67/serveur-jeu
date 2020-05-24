const { flag_ctrl } = require('../controllers');

module.exports = (io, socket, player) => {
    /**
     * Récupère les cristaux
     */
    socket.on('getFlags', () => {
        socket.emit('getFlags', flag_ctrl.getAll());
    });

    /**
     * Crée un cristal
     *
     * @param array coordinates Position du cristal
     * @param function onSuccess Fonction de callback
     */
    socket.on('createFlag', (coordinates, onSuccess) => {
        onSuccess(flag_ctrl.createFlag(coordinates));
    });

    /**
     * Crée des cristaux aléatoirement
     *
     * @param int nbFlags Le nombre de cristaux à créer
     */
    socket.on('createRandomFlags', nbFlags => {
        const nbCreated = flag_ctrl.createRandom(nbFlags);
        if (nbCreated === 0) {
            socket.emit(
                'onError',
                "Il n'y a plus de place pour ajouter des cristaux"
            );
        }
    });

    /**
     * Capture un cristal
     *
     * @param int flagId Identifiant du cristal
     * @param int teamId Identifiant de l'équipe qui va le posséder
     */
    socket.on('captureFlag', ({ flagId, teamId }) => {
        if (!player || (player && !player.immobilizedUntil)) {
            flag_ctrl.captureFlag(io, flagId, teamId, player);
        }
    });

    /**
     * Décapture un cristal
     *
     * @param int flagId Identifiant du cristal
     */
    socket.on('resetFlag', flagId => {
        flag_ctrl.resetFlag(flagId);
    });

    /**
     * Déplace un cristal
     *
     * @param array coordinates Les nouvelles coordonnées du cristal
     * @param int flagId Identifiant du cristal
     */
    socket.on('moveFlag', ({ coordinates, flagId }) => {
        flag_ctrl.moveFlag(coordinates, flagId);
    });

    /**
     * Supprime un cristal
     *
     * @param int id Identifiant du cristal
     */
    socket.on('deleteFlag', id => {
        flag_ctrl.delete(id);
    });

    /**
     * Supprime tous les cristaux
     */
    socket.on('deleteAllFlags', () => {
        flag_ctrl.deleteAll();
    });
};
