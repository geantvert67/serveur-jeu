const { item_model_ctrl } = require('../controllers');

module.exports = (io, socket, player) => {
    socket.on('getItemModels', () => {
        socket.emit('getItemModels', item_model_ctrl.getAll());
    });
};
