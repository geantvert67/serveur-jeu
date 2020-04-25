const moment = require('moment'),
    {
        item_instance_ctrl,
        item_ctrl,
        flag_ctrl,
        team_ctrl,
        player_ctrl
    } = require('../controllers');

module.exports = (io, socket, player) => {
    socket.on('useTempete', id => {
        item_ctrl.randomize();
        flag_ctrl.randomize();
        item_instance_ctrl.delete(id, player);
    });

    socket.on('useDisloqueur', id => {
        flag_ctrl.getAll().forEach(f => flag_ctrl.resetFlag(f.id));
        item_instance_ctrl.delete(id, player);
    });

    socket.on('useTransporteur', id => {
        if (!player.hasTransporteur) {
            player.hasTransporteur = true;
            item_instance_ctrl.delete(id, player);
        }
    });

    socket.on('usePortailTransfert', ({ id, username, itemId }) => {
        const item = item_instance_ctrl.getById(itemId);
        const target = player_ctrl.getByUsername(username);

        if (target && item) {
            if (item_ctrl.giveItem(target, item)) {
                item_instance_ctrl.removeFromInventory(itemId, player);
                item_instance_ctrl.delete(id, player);
            }
        }
    });

    socket.on('useSentinelle', ({ id, flagId }) => {
        const flag = flag_ctrl.getById(flagId);
        const item = item_instance_ctrl.getById(id);

        if (
            flag &&
            flag.team &&
            flag.team.id === team_ctrl.findByPlayer(player.username).id
        ) {
            if (flag.capturedUntil) {
                // TODO : reset timer and create a new one
            } else {
                flag.capturedUntil = moment().add(item.effectDuration, 's');
                setTimeout(() => {
                    flag.capturedUntil = null;
                }, item.effectDuration * 1000);
            }
            item_instance_ctrl.delete(id, player);
        }
    });
};
