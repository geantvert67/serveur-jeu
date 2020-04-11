const { item_ctrl } = require('../controllers');

module.exports = (io, socket, player) => {
    socket.on('getItems', () => {
        socket.emit('getItems', item_ctrl.getAll());
    });

    socket.on('getPlayerItems', () => {
        socket.emit('getPlayerItems', player.inventory);
    });

    socket.on('takeItem', id => {
        item_ctrl.takeItem(player, id);
        socket.emit('getPlayerItems', player.inventory);
    });

    socket.on('dropItem', ({ id, coordinates }) => {
        item_ctrl.dropItem(player, id, coordinates);
        socket.emit('getPlayerItems', player.inventory);
    });

    socket.on('moveItem', ({ coordinates, itemId }) => {
        item_ctrl.moveItem(coordinates, itemId);
    });

    socket.on('deleteItem', id => {
        item_ctrl.delete(id);
    });
};
