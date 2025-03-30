import { IEvents } from "../base/events";

export interface IDeliveryPopup {
  deliveryForm: HTMLFormElement; // форма оформления
  buttonAlt: HTMLButtonElement[]; // кнопки выбора способа оплаты
  paymentSelection: String; // выбранный способ
  formErrors: HTMLElement; // сообщения об ошибках
  render(): HTMLElement;
}

export class DeliveryPopup implements IDeliveryPopup {
  deliveryForm: HTMLFormElement;
  buttonAlt: HTMLButtonElement[];
  buttonSubmit: HTMLButtonElement;
  formErrors: HTMLElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this.deliveryForm = template.content.querySelector('.form').cloneNode(true) as HTMLFormElement;
    this.buttonAlt = Array.from(this.deliveryForm.querySelectorAll('.button_alt'));
    this.buttonSubmit = this.deliveryForm.querySelector('.order__button');
    this.formErrors = this.deliveryForm.querySelector('.form__errors');

    // события при выборе оплаты
    this.buttonAlt.forEach(item => {
      item.addEventListener('click', () => {
        this.paymentSelection = item.name;
        events.emit('order:paymentSelection', item);
      });
    });

    // событие изменения адреса
    this.deliveryForm.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      const field = target.name;
      const value = target.value;
      this.events.emit(`order:changeAddress`, { field, value });
    });

    // событие отправки формы
    this.deliveryForm.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      this.events.emit('contacts:open');
    });
  }

  // выделение выбранного метода оплаты
  set paymentSelection(paymentMethod: string) {
    this.buttonAlt.forEach(item => {
      item.classList.toggle('button_alt-active', item.name === paymentMethod);
    })
  }

  // проверка правильности ввода и разблокировка кнопки
  set valid(value: boolean) {
    this.buttonSubmit.disabled = !value;
  }

  render() {
    return this.deliveryForm
  }
}