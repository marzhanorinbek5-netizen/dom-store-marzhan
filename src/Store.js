export class Store {
  constructor() {
    this.items = [];
  }

  add(item) {
    this.items.push(item);
    return item;
  }

  remove(index) {
    this.items.splice(index, 1);
  }

  updateQty(index, qty) {
    if (this.items[index]) {
      this.items[index].qty = qty;
    }
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }
}
