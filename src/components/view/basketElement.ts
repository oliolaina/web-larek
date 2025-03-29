import { ProductItem } from "../../types";
import { IEvents } from "../base/events";

export interface IBasketElement {
  basketItem: HTMLElement; // элемент корзины (товар)
	index:HTMLElement; // порядковый номер в списке
	title: HTMLElement; // название
	price: HTMLElement; // цена в синапсах
	buttonDelete: HTMLButtonElement; // кнопка удаления из корзины
	render(data: ProductItem, item: number): HTMLElement; // установка элемента
}

export class BasketElement implements IBasketElement {
  basketItem: HTMLElement;
	index:HTMLElement;
	title: HTMLElement;
	price: HTMLElement;
	buttonDelete: HTMLButtonElement;

  constructor (template: HTMLTemplateElement, protected events: IEvents, actions?: {onClick: (event: MouseEvent) => void}) {
    this.basketItem = template.content.querySelector('.basket__item').cloneNode(true) as HTMLElement;
		this.index = this.basketItem.querySelector('.basket__item-index');
		this.title = this.basketItem.querySelector('.card__title');
		this.price = this.basketItem.querySelector('.card__price');
		this.buttonDelete = this.basketItem.querySelector('.basket__item-delete');
		if (actions?.onClick) {
			this.buttonDelete.addEventListener('click', actions.onClick);
		}
  }

	protected setPrice(value: number | null) {
    if (value === null) {
      return 'Бесценно'
    }
    return String(value) + ' синапсов'
  }

	render(data: ProductItem, item: number) {
		this.index.textContent = String(item);
		this.title.textContent = data.title;
		this.price.textContent = this.setPrice(data.price);
		return this.basketItem;
	}
}