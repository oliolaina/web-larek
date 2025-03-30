import { IEvents } from "../base/events";

export class IOrderDone {
  orderSuccess: HTMLElement;
  description: HTMLElement;
  button: HTMLButtonElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this.orderSuccess = template.content.querySelector('.order-success').cloneNode(true) as HTMLElement;
    this.description = this.orderSuccess.querySelector('.order-success__description');
    this.button = this.orderSuccess.querySelector('.order-success__close');
    this.button.addEventListener('click', () => { events.emit('success:close') });
  }

  render(total: number) {
    this.description.textContent = String(`Списано ${total} синапсов`);
    return this.orderSuccess
  }
}