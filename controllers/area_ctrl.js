const { area_store } = require('../stores');

module.exports = {
    getAll: () => {
        return area_store.getAll();
    }
};
