const { item_model_store } = require('../stores');

module.exports = {
    getAll: () => {
        return item_model_store.getAll();
    }
};
