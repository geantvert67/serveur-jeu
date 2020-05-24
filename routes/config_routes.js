const { config_ctrl } = require('../controllers');

module.exports = (io, socket, player) => {
    /**
     * Récupère la configuration
     */
    socket.on('getConfig', () => {
        socket.emit('getConfig', config_ctrl.get());
    });

    /**
     * Modifie les paramètres de la configuration
     *
     * @param object newConfig Les nouveax paramètres
     */
    socket.on('updateConfig', newConfig => {
        config_ctrl.update(newConfig);
        socket.emit('getConfig', config_ctrl.get());
    });
};
