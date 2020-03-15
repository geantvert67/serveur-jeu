const { marker_store } = require('../stores');

module.exports = {
    getAll: () => {
        return marker_store.getAll();
    }
};
