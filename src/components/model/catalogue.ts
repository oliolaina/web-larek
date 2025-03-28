import { ProductItem, ICatalog } from "../../types";
import { IEvents } from "../base/events";

export class CatalogModel implements ICatalog {
  protected _productCards: ProductItem[];
  selectedСard: ProductItem;

  constructor(protected events: IEvents) {
    this._productCards = []
  }

  set productCards(data: ProductItem[]) {
    this._productCards = data;
    this.events.emit('productCards:receive');
  }

  get productCards() {
    return this._productCards;
    }

  //открытие попапа с товаром
  open(item: ProductItem) {
    this.selectedСard = item;
    this.events.emit('modalCard:open', item)
  }
}