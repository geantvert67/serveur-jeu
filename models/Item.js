class Item {
    constructor(i, itemModel) {
        this.id = i.id;
        this.quantity = i.quantity;
        this.coordinates = i.position.coordinates;
        this.itemModel = itemModel;
    }
}

module.exports = Item;
