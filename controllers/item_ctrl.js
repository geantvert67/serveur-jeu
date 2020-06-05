const _ = require('lodash'),
    geolib = require('geolib'),
    moment = require('moment'),
    config_ctrl = require('./config_ctrl'),
    item_instance_ctrl = require('./item_instance_ctrl'),
    item_model_ctrl = require('./item_model_ctrl'),
    interval_ctrl = require('./interval_ctrl'),
    area_ctrl = require('./area_ctrl'),
    { Item } = require('../models'),
    { item_store } = require('../stores'),
    { getRandomPoint, calculateRadius } = require('../utils');

let maxId = null;

const _this = (module.exports = {
    /**
     * Renvoie tous les items
     */
    getAll: () => {
        return item_store.getAll();
    },

    /**
     * Renvoie un item à partir d'un identifiant
     *
     * @param int id Identifiant
     */
    getById: id => {
        return _.find(_this.getAll(), { id });
    },

    /**
     * Renvoie les items dans un rayon à partir d'une position
     *
     * @param array coordinates Position
     * @param boolean checkVisibility S'il faut utiliser le rayon de visibilité
     * ou d'action
     * @param array inActionRadius Items à ne pas renvoyer
     * @param array radiusChange Liste des impacts sur le rayon
     */
    getInRadius: (
        coordinates,
        checkVisibility,
        inActionRadius = [],
        radiusChange = []
    ) => {
        return _this.getAll().filter(i => {
            const radius = checkVisibility
                ? i.visibilityRadius
                : i.actionRadius;

            return (
                !_.some(inActionRadius, i) &&
                geolib.isPointWithinRadius(
                    {
                        latitude: coordinates[0],
                        longitude: coordinates[1]
                    },
                    {
                        latitude: i.coordinates[0],
                        longitude: i.coordinates[1]
                    },
                    calculateRadius(radius, radiusChange)
                )
            );
        });
    },

    /**
     * Renvoie un identifiant pour créer un item
     */
    getMaxId: () => {
        if (maxId) {
            maxId++;
            return maxId;
        } else {
            const item = _.maxBy(_this.getAll(), 'id');
            return item ? item.id + 1 : 1;
        }
    },

    /**
     * Récupère un modèle d'item à partir d'un nom puis crée un item
     *
     * @param array coordinates Position
     * @param string name Nom du modèle d'item
     */
    createItem: (coordinates, name) => {
        const itemModel = item_model_ctrl.getByName(name);

        if (itemModel) {
            return _this.create(itemModel, coordinates);
        }
        return null;
    },

    /**
     * Créer un item
     *
     * @param object item Modèle d'item
     * @param array coordinates Position
     */
    create: (item, coordinates) => {
        const i = _.cloneDeep(item);
        i.id = _this.getMaxId();
        i.quantity = 1;
        i.position = { coordinates };

        const newItem = new Item(i);
        item_store.add(newItem);
        return newItem;
    },

    /**
     * Crée des items aléatoirement
     *
     * @param int nbItems Le nombre d'items à créer
     * @param string name Nom du modèle d'item
     */
    createRandom: (nbItems, name) => {
        for (let i = 0; i < nbItems; i++) {
            const coordinates = getRandomPoint(
                area_ctrl.getGameArea(),
                area_ctrl.getForbiddenAreas()
            );
            _this.createItem(coordinates, name);
        }
    },

    /**
     * Modifie les paramètres d'un item
     *
     * @param int id Identifiant de l'item
     * @param object newItem Les nouveaux paramètres de l'item
     */
    update: (id, newItem) => {
        let item = _this.getById(id);
        Object.keys(newItem)
            .filter(e => newItem[e])
            .forEach(e => (item[e] = newItem[e]));
        item.nbUpdates++;
    },

    /**
     * Renvoie vrai si l'inventaire du joueur n'est pas plein, faux sinon
     *
     * @param object player Joueur
     */
    isInventoryNotFull: player => {
        const { inventorySize } = config_ctrl.get();
        const maxInventorySize = player.hasTransporteur
            ? inventorySize * 2
            : inventorySize;

        return player.inventory.length < maxInventorySize;
    },

    /**
     * Ramasse un item
     *
     * @param object player Joueur
     * @param int id Identifiant de l'item
     */
    takeItem: (player, id) => {
        const item = _this.getById(id);

        if (
            _this.isInventoryNotFull(player) &&
            (!item.waitingUntil || moment().isSameOrAfter(item.waitingUntil))
        ) {
            const { waitingPeriod } = item;
            const itemInstance = item_instance_ctrl.create(item);

            if (itemInstance) {
                player.inventory.push(itemInstance);
                if (item.quantity > 1) {
                    item.quantity--;
                    item.nbUpdates++;

                    if (waitingPeriod) {
                        item.waitingUntil = moment().add(waitingPeriod, 's');
                        const interval = setTimeout(() => {
                            item.waitingUntil = null;
                            item.nbUpdates++;
                            interval_ctrl.removeItemIntervalByObjectId(id);
                        }, waitingPeriod * 1000);
                        interval_ctrl.createItemInterval(interval, item.id);
                    }
                    if (item.autoMove) {
                        item.coordinates = getRandomPoint(
                            area_ctrl.getGameArea(),
                            area_ctrl.getForbiddenAreas()
                        );
                    }
                } else {
                    _this.delete(item.id);
                }
            }
        }
    },

    /**
     * Donne un item à un joueur
     *
     * @param object player Joueur recevant l'item
     * @param object itemInstance Item à donner
     */
    giveItem: (player, itemInstance) => {
        if (_this.isInventoryNotFull(player)) {
            player.inventory.push(itemInstance);
            return true;
        }
        return false;
    },

    /**
     * Dépose un item
     *
     * @param object player Joueur déposant l'item
     * @param int id Identifiant de l'item
     * @param array coordinates Position où déposer l'item
     */
    dropItem: (player, id, coordinates) => {
        const item = item_instance_ctrl.getById(id);
        _this.create(_.cloneDeep(item), coordinates);
        item_instance_ctrl.delete(id, player);
    },

    /**
     * Déplace un item
     *
     * @param array coordinates Nouvelle position
     * @param int flagId Identifiant de l'item
     */
    moveItem: (coordinates, itemId) => {
        const item = _this.getById(itemId);
        item.coordinates = coordinates;
        item.nbUpdates++;
    },

    /**
     * Supprime un item
     *
     * @param int id Identifiant de l'item
     */
    delete: id => {
        item_store.remove(id);
        interval_ctrl.removeItemIntervalByObjectId(id);
    },

    /**
     * Supprime tous les items d'un certain nom
     *
     * @param string name Nom du modèle d'item
     */
    deleteByName: name => {
        _this
            .getAll()
            .filter(i => i.name === name)
            .forEach(i => {
                item_store.remove(i.id);
                interval_ctrl.removeItemIntervalByObjectId(i.id);
            });
    },

    /**
     * Modifie aléatoirement la position de tous les items
     */
    randomize: () => {
        _this.getAll().forEach(i => {
            i.coordinates = getRandomPoint(
                area_ctrl.getGameArea(),
                area_ctrl.getForbiddenAreas()
            );
            i.nbUpdates++;
        });
    }
});
