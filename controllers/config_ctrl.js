const { config_store } = require('../stores');

const _this = (module.exports = {
    /**
     * Renvoie la configuration
     */
    get: () => {
        return config_store.get();
    },

    /**
     * Modifie les paramètres de la configuration
     *
     * @param object newConfig Les nouveax paramètres
     */
    update: newConfig => {
        const config = _this.get();
        config_store.set({ ...config, ...newConfig });
    },

    /**
     * Renvoie vrai si la partie est déjà lancée, faux sinon
     */
    isLaunched: () => {
        return _this.get().launched;
    }
});
