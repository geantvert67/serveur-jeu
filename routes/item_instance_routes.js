const { item_instance_ctrl, item_ctrl, flag_ctrl } = require('../controllers');

module.exports = (io, socket, player) => {
    socket.on('useTempete', id => {
        item_ctrl.randomize();
        flag_ctrl.randomize();
        item_instance_ctrl.delete(id, player);
        socket.emit('getPlayerItems', player.inventory);
    });

    socket.on('useDisloqueur', id => {
        flag_ctrl.getAll().forEach(f => flag_ctrl.resetFlag(f.id));
        item_instance_ctrl.delete(id, player);
        socket.emit('getPlayerItems', player.inventory);
    });
};
