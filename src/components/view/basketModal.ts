import { createElement } from "../../utils/utils";
import { IEvents } from "../base/events";

export interface IBasket {
  basket: HTMLElement; // содержимое модального окна с корзиной
  title: HTMLElement; // заголовок модального окна
  basketList: HTMLElement; // список, хранящий товары корзины
  button: HTMLButtonElement; // кнопка оформления
  basketPrice: HTMLElement; // отображение цены
  headerBasketButton: HTMLButtonElement; // иконка корзины на главной странице
  headerBasketCounter: HTMLElement; // значок количества товаров в корзине
  renderHeaderBasketCounter(value: number): void;
  renderSumAllProducts(sumAll: number): void;
  render(): HTMLElement;
}

export class Basket implements IBasket {
  basket: HTMLElement;
  title: HTMLElement;
  basketList: HTMLElement;
  button: HTMLButtonElement;
  basketPrice: HTMLElement;
  headerBasketButton: HTMLButtonElement;
  headerBasketCounter: HTMLElement;
  
  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this.basket = template.content.querySelector('.basket').cloneNode(true) as HTMLElement;
    this.title = this.basket.querySelector('.modal__title');
    this.basketList = this.basket.querySelector('.basket__list');
    this.button = this.basket.querySelector('.basket__button');
    this.basketPrice = this.basket.querySelector('.basket__price');
    this.headerBasketButton = document.querySelector('.header__basket');
    this.headerBasketCounter = document.querySelector('.header__basket-counter');
    
    this.headerBasketButton.addEventListener('click', () => { this.events.emit('basket:open') }); // событие перехода в окно корзины
    this.button.addEventListener('click', () => { this.events.emit('order:open') }); // событие оформления заказа
    this.items = [];
  }

  // установка элементов корзины
  set items(items: HTMLElement[]) {
    if (items.length) {
      this.basketList.replaceChildren(...items);
      this.button.removeAttribute('disabled');
    } else {
      this.button.setAttribute('disabled', 'disabled');
      this.basketList.replaceChildren(createElement<HTMLParagraphElement>('p', { textContent: 'Корзина пуста' }));
    }
  }

  // установка количества товаров
  renderHeaderBasketCounter(value: number) {
    this.headerBasketCounter.textContent = String(value);
  }
  
  // установка общей суммы
  renderSumAllProducts(sumAll: number) {
    this.basketPrice.textContent = String(sumAll + ' синапсов');
  }

  // отображение элемента
  render() {
    this.title.textContent = 'Корзина';
    return this.basket;
  }
}