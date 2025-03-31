import { itemCard } from "./itemCard";
import { ProductItem } from "../../types";
import { IEvents } from "../base/events";

export class itemCardPopup extends itemCard {
  text: HTMLElement; //описание товара
  button: HTMLElement; // кнопка добавления в корзину

  constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: {onClick: (event: MouseEvent) => void}) {
    super(template, events, actions);
    this.text = this._cardElement.querySelector('.card__text');
    this.button = this._cardElement.querySelector('.card__button');
    console.log('create',this.button);
    this.button.addEventListener('click', () => { this.events.emit('card:addBasket', this.button) });
  }

  checkButton(item: ProductItem) : void{
    console.log('check',this.button);
    if ( item && item.inBasket === true){
      this.button.setAttribute('disabled', 'true');
      this.button.textContent = 'Уже в корзине';
    } else {
      this.button.removeAttribute('disabled');
      this.button.textContent = 'Купить';
    }
    
  }

  checkSale(data:ProductItem) {
    if(data.price) {
      return 'Купить'
    } else {
      this.button.setAttribute('disabled', 'true')
      return 'Не продается'
    }
  }

  render(data: ProductItem): HTMLElement {
    this._cardCategory.textContent = data.category;
    this.cardCategory = data.category;
    this._cardTitle.textContent = data.title;
    this._cardImage.src = data.image;
    this._cardImage.alt = this._cardTitle.textContent;
    this._cardPrice.textContent = this.setPrice(data.price);
    this.text.textContent = data.description;
    this.checkButton(data);
    this.checkSale(data);
    return this._cardElement;
  }
}