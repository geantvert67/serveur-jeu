const { item_ctrl } = require('../controllers');

module.exports = (io, socket, player) => {
    socket.on('getItems', () => {
        socket.emit('getItems', item_ctrl.getAll());
    });

    socket.on('takeItem', id => {
        if (!player || (player && !player.immobilized)) {
            item_ctrl.takeItem(player, id);
        }
    });

    socket.on('dropItem', ({ id, coordinates }) => {
        item_ctrl.dropItem(player, id, coordinates);
    });

    socket.on('moveItem', ({ coordinates, itemId }) => {
        item_ctrl.moveItem(coordinates, itemId);
    });

    socket.on('deleteItem', id => {
        item_ctrl.delete(id);
    });
};
