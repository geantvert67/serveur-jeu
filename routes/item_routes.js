const { item_ctrl } = require('../controllers');

module.exports = (io, socket, player) => {
    socket.on('getItems', () => {
        socket.emit('getItems', item_ctrl.getAll());
    });

    socket.on('deleteItem', id => {
        item_ctrl.delete(id);
    });
};
