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
    /**
     * Utilise une tempête
     *
     * @param int id Identifiant de l'item à utiliser
     */
    socket.on('useTempete', id => {
        item_ctrl.randomize();
        flag_ctrl.randomize();
        item_instance_ctrl.delete(id, player);
    });

    /**
     * Utilise un disloqueur
     *
     * @param int id Identifiant de l'item à utiliser
     */
    socket.on('useDisloqueur', id => {
        flag_ctrl.getAll().forEach(f => flag_ctrl.resetFlag(f.id));
        item_instance_ctrl.delete(id, player);
    });

    /**
     * Utilise un transporteur
     *
     * @param int id Identifiant de l'item à utiliser
     */
    socket.on('useTransporteur', id => {
        if (!player.hasTransporteur) {
            player.hasTransporteur = true;
            player.nbUpdates++;
            item_instance_ctrl.delete(id, player);
        }
    });

    /**
     * Utilise un portail de transfert
     *
     * @param int id Identifiant de l'item à utiliser
     * @param string username Nom d'utilisateur du joueur à qui l'item sera donné
     * @param int itemId Identifiant de l'item à donner
     */
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

    /**
     * Utilise une sentinelle
     *
     * @param int id Identifiant de l'item à utiliser
     * @param int flagId Identifiant du cristal
     */
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

    /**
     * Utilise un oracle
     *
     * @param int id Identifiant de l'item à utiliser
     * @param int flagId Identifiant du cristal
     */
    socket.on('useOracle', ({ id, flagId }) => {
        const flag = flag_ctrl.getById(flagId);

        if (
            flag &&
            flag.team &&
            flag.team.id === team_ctrl.findByPlayer(player.username).id &&
            !flag.capturedUntil
        ) {
            flag.hasOracle = true;
            flag.nbUpdates++;
            item_instance_ctrl.delete(id, player);
        }
    });

    /**
     * Installe un canon
     *
     * @param int id Identifiant de l'item à installer
     * @param array coordinates Position où le piège sera installé
     * @param int delay Nombre de secondes avant que le piège soit actif
     */
    socket.on('useCanon', ({ id, coordinates, delay }) => {
        const item = item_instance_ctrl.getById(id);
        const trap = trap_ctrl.create(item, player, coordinates);

        trap.inactiveUntil = moment().add(delay, 's');
        const timer = setTimeout(() => {
            trap.inactiveUntil = null;
            trap.nbUpdates++;
        }, delay * 1000);
        interval_ctrl.createTrapInterval(timer, trap.id);
        item_instance_ctrl.delete(id, player);
    });

    /**
     * Installe un transducteur
     *
     * @param int id Identifiant de l'item à installer
     * @param array coordinates Position où le piège sera installé
     * @param int delay Nombre de secondes avant que le piège soit actif
     */
    socket.on('useTransducteur', ({ id, coordinates, delay }) => {
        const item = item_instance_ctrl.getById(id);
        const trap = trap_ctrl.create(item, player, coordinates);

        trap.inactiveUntil = moment().add(delay, 's');
        const timer = setTimeout(() => {
            trap.inactiveUntil = null;
            trap.nbUpdates++;
        }, delay * 1000);
        interval_ctrl.createTrapInterval(timer, trap.id);
        item_instance_ctrl.delete(id, player);
    });

    /**
     * Utilise une antenne
     *
     * @param int id Identifiant de l'item à utiliser
     * @param function onSuccess Fonction de callback
     */
    socket.on('useAntenne', ({ id }, onSuccess) => {
        const freeFlag = _.sample(flag_ctrl.getAll().filter(f => !f.team));

        if (freeFlag) {
            if (!_.find(player.antenneFlagsId, i => i === freeFlag.id)) {
                player.antenneFlagsId.push(freeFlag.id);
                const timer = setTimeout(() => {
                    _.remove(player.antenneFlagsId, i => i === freeFlag.id);
                }, 10000);
                interval_ctrl.createOtherInterval(timer, id);
            }

            onSuccess(freeFlag.coordinates);
        } else {
            socket.emit('onError', 'Tous les drapeaux sont déjà capturés');
        }

        item_instance_ctrl.delete(id, player);
    });

    /**
     * Équipe une sonde
     *
     * @param int id Identifiant de l'item à équiper
     */
    socket.on('useSonde', id => {
        const item = item_instance_ctrl.getById(id);

        player.visibilityChange.push({ id, percent: item.effectStrength });
        item.equiped = true;
        item.nbUpdates++;
        const timer = setTimeout(() => {
            _.remove(player.visibilityChange, o => o.id === item.id);
            item_instance_ctrl.delete(id, player);
        }, item.effectDuration * 1000);
        interval_ctrl.createOtherInterval(timer, id);
    });

    /**
     * Utilise un intercepteur
     *
     * @param int id Identifiant de l'item à utiliser
     */
    socket.on('useIntercepteur', id => {
        const item = item_instance_ctrl.getById(id);
        const ennemis = team_ctrl.getEnnemis(
            team_ctrl.findByPlayer(player.username).id
        );

        ennemis.forEach(e => {
            if (e.noyaux.length > 0) {
                const noyauId = e.noyaux.pop();
                e.nbUpdates++;
                item_instance_ctrl.delete(noyauId, e);
            } else {
                e.visibilityChange.push({ id, percent: -item.effectStrength });
            }
        });
        const timer = setTimeout(() => {
            ennemis.forEach(e =>
                _.remove(e.visibilityChange, o => o.id === item.id)
            );
        }, item.effectDuration * 1000);
        interval_ctrl.createOtherInterval(timer, id);
        item_instance_ctrl.delete(id, player);
    });

    /**
     * Équipe un noyau
     *
     * @param int id Identifiant de l'item à équiper
     */
    socket.on('useNoyau', id => {
        const item = item_instance_ctrl.getById(id);
        item.equiped = true;
        item.nbUpdates++;
        player.noyaux.push(id);
        player.nbUpdates++;
    });

    /**
     * Déséquipe une sonde
     *
     * @param int id Identifiant de l'item à déséquiper
     */
    socket.on('unequipSonde', id => {
        _.remove(player.visibilityChange, o => o.id === id);
        item_instance_ctrl.delete(id, player);
        interval_ctrl.removeOtherIntervalById(id);
    });

    /**
     * Déséquipe un noyau
     *
     * @param int id Identifiant de l'item à déséquiper
     */
    socket.on('unequipNoyau', id => {
        _.remove(player.noyaux, o => o === id);
        player.nbUpdates++;
        item_ctrl.dropItem(player, id, player.coordinates);
    });
};
