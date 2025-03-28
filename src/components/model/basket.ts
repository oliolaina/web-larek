import { ProductItem, IBasket } from "../../types";

export class BasketModel implements IBasket {
  // список карточек товара в корзине
  protected _basketProducts: ProductItem[]; 

  //инициализация пустого списка товаров в конструкторе
  constructor() {
    this._basketProducts = [];
  }

  //сеттер содержимого корзины
  set basketProducts(data: ProductItem[]) {
    this._basketProducts = data;
  }

  //геттер товаров корзины
  get basketProducts() {
    return this._basketProducts;
  }

  // количество товаров в корзине
  getAmount() {
    return this.basketProducts.length;
  }

  // сумма всех товаров в корзине
  calcTotalSum() {
    let sumAll = 0;
    this.basketProducts.forEach(item => {
      sumAll = sumAll + item.price;
    });
    return sumAll;
  }

  // добавить карточку товара в корзину
  add(data: ProductItem) {
    this._basketProducts.push(data);
  }

  // удалить карточку товара из корзины
  remove(item: ProductItem) {
    const index = this._basketProducts.indexOf(item);
    if (index >= 0) {
      this._basketProducts.splice(index, 1);
    }
  }

  //очистить корзину
  clear() {
    this.basketProducts = []
  }
}