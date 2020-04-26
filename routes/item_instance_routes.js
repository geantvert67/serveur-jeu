const moment = require('moment'),
    _ = require('lodash'),
    {
        item_instance_ctrl,
        interval_ctrl,
        item_ctrl,
        flag_ctrl,
        team_ctrl,
        player_ctrl,
        trap_ctrl
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
            !flag.hasOracle &&
            flag.team &&
            flag.team.id === team_ctrl.findByPlayer(player.username).id
        ) {
            if (flag.capturedUntil) {
                interval_ctrl.removeCapturedFlagIntervalByObjectId(flag.id);
                const currentDuration = Math.floor(
                    moment
                        .duration(moment(flag.capturedUntil).diff(moment()))
                        .asSeconds()
                );

                flag_ctrl.setFlagCapturedDuration(
                    flag,
                    item.effectDuration + currentDuration
                );
            } else {
                flag_ctrl.setFlagCapturedDuration(flag, item.effectDuration);
            }
            item_instance_ctrl.delete(id, player);
        }
    });

    socket.on('useOracle', ({ id, flagId }) => {
        const flag = flag_ctrl.getById(flagId);

        if (
            flag &&
            flag.team &&
            flag.team.id === team_ctrl.findByPlayer(player.username).id &&
            !flag.capturedUntil
        ) {
            flag.hasOracle = true;
            item_instance_ctrl.delete(id, player);
        }
    });

    socket.on('useCanon', ({ id, coordinates, delay }) => {
        const item = item_instance_ctrl.getById(id);
        const trap = trap_ctrl.create(item, player, coordinates);

        trap.inactiveUntil = moment().add(delay, 's');
        const timer = setTimeout(() => {
            trap.inactiveUntil = null;
        }, delay * 1000);
        interval_ctrl.createTrapInterval(timer, trap.id);
        item_instance_ctrl.delete(id, player);
    });

    socket.on('useTransducteur', ({ id, coordinates, delay }) => {
        const item = item_instance_ctrl.getById(id);
        const trap = trap_ctrl.create(item, player, coordinates);

        item.equiped = true;
        trap.inactiveUntil = moment().add(delay, 's');
        const timer = setTimeout(() => {
            trap.inactiveUntil = null;
        }, delay * 1000);
        interval_ctrl.createTrapInterval(timer, trap.id);
    });

    socket.on('useAntenne', ({ id }, onSuccess) => {
        const freeFlag = _.sample(flag_ctrl.getAll().filter(f => !f.team));

        if (freeFlag) {
            if (!_.find(player.antenneFlagsId, id => id === freeFlag.id)) {
                player.antenneFlagsId.push(freeFlag.id);
                setTimeout(() => {
                    _.remove(player.antenneFlagsId, id => id === freeFlag.id);
                }, 10000);
            }

            onSuccess(freeFlag.coordinates);
        } else {
            socket.emit('onError', 'Tous les drapeaux sont déjà capturés');
        }

        item_instance_ctrl.delete(id, player);
    });
};
