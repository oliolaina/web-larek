import './scss/styles.scss';

import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { ApiModel } from './components/model/getGoods';
import { CatalogModel } from './components/model/catalogue';
import { itemCard } from './components/view/itemCard';
import { itemCardPopup } from './components/view/itemCardPopup';
import { UserInfo, ProductItem, PaymentType } from './types';
import { Modal } from './components/view/Popup';
import { ensureElement } from './utils/utils';
import { BasketModel } from './components/model/basket';
import { Basket } from './components/view/basketModal';
import { BasketElement } from './components/view/basketElement';
import { userInfoModel } from './components/model/userInfo';
import { DeliveryPopup } from './components/view/deliveryPopup';
import { Contacts } from './components/view/contactsPopup';
import { IOrderDone } from './components/view/orderDonePopup';

const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

const apiModel = new ApiModel(CDN_URL, API_URL);
const events = new EventEmitter();
const dataModel = new CatalogModel(events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(basketTemplate, events);
const basketModel = new BasketModel();
const UserInfoModel = new userInfoModel(events);
const order = new DeliveryPopup(orderTemplate, events);
const contacts = new Contacts(contactsTemplate, events);

//Отображения карточек товара на странице
events.on('productCards:receive', () => {
  dataModel.productCards.forEach(item => {
    const card = new itemCard(cardCatalogTemplate, events, { onClick: () => events.emit('card:select', item) });
    ensureElement<HTMLElement>('.gallery').append(card.render(item));
  });
});

// Получить объект данных "IProductItem" карточки по которой кликнули
events.on('card:select', (item: ProductItem) => { dataModel.open(item) });

//Открываем модальное окно карточки товара 
events.on('modalCard:open', (item: ProductItem) => {
  const cardPreview = new itemCardPopup(cardPreviewTemplate, events)
  modal.content = cardPreview.render(item);
  modal.render();
});

// Добавление карточки товара в корзину 
events.on('card:addBasket', () => {
  basketModel.add(dataModel.selectedСard); // добавить карточку товара в корзину
  basket.renderHeaderBasketCounter(basketModel.getAmount()); // отобразить количество товара на иконке корзины
  modal.close();
});

// Открытие модального окна корзины
events.on('basket:open', () => {
  basket.renderSumAllProducts(basketModel.calcTotalSum());  // отобразить сумма всех продуктов в корзине
  let i = 0;
  basket.items = basketModel.basketProducts.map((item:ProductItem) => {
    const basketItem = new BasketElement(cardBasketTemplate, events, { onClick: () => events.emit('basket:basketItemRemove', item) });
    i = i + 1;
    return basketItem.render(item, i);
  })
  modal.content = basket.render();
  modal.render();
});

// Удаление карточки товара из корзины
events.on('basket:basketItemRemove', (item: ProductItem) => {
  basketModel.remove(item);
  basket.renderHeaderBasketCounter(basketModel.getAmount()); // отобразить количество товара на иконке корзины
  basket.renderSumAllProducts(basketModel.calcTotalSum()); // отобразить сумма всех продуктов в корзине
  let i = 0;
  basket.items = basketModel.basketProducts.map((item:ProductItem) => {
    const basketItem = new BasketElement(cardBasketTemplate, events, { onClick: () => events.emit('basket:basketItemRemove', item) });
    i = i + 1;
    return basketItem.render(item, i);
  })
});

// Открытие модального окна "способа оплаты" и "адреса доставки"
events.on('order:open', () => {
  modal.content = order.render();
  modal.render();
  UserInfoModel.items = basketModel.basketProducts.map((item:ProductItem) => item.id); // передаём список id товаров которые покупаем
});

events.on('order:paymentSelection', (button: HTMLButtonElement) => { UserInfoModel.payment = button.name as PaymentType }) // передаём способ оплаты

// Отслеживаем изменение в поле в вода "адреса доставки" 
events.on(`order:changeAddress`, (data: { field: string, value: string }) => {
    UserInfoModel.setOrderAddress(data.field, data.value);
});

// Валидация данных строки "address" и payment 
events.on('formErrors:address', (errors: Partial<UserInfo>) => {
  const { address, payment } = errors;
  order.valid = !address && !payment;
  order.formErrors.textContent = Object.values({address, payment}).filter(i => !!i).join('; ');
})

// Открытие модального окна "Email" и "Телефон" 
events.on('contacts:open', () => {
    UserInfoModel.total = basketModel.calcTotalSum();
  modal.content = contacts.render();
  modal.render();
});

// Отслеживаем изменение в полях вода "Email" и "Телефон" 
events.on(`contacts:changeInput`, (data: { field: string, value: string }) => {
    UserInfoModel.setOrderData(data.field, data.value);
});

// Валидация данных строки "Email" и "Телефон" 
events.on('formErrors:change', (errors: Partial<UserInfo>) => {
  const { email, phone } = errors;
  contacts.valid = !email && !phone;
  contacts.formErrors.textContent = Object.values({phone, email}).filter(i => !!i).join('; ');
})

// Открытие модального окна "Заказ оформлен" 
events.on('success:open', () => {
  apiModel.postOrderLot(UserInfoModel.getOrderLot())
    .then((data) => {
      console.log(data); // ответ сервера
      const success = new IOrderDone(successTemplate, events);
      modal.content = success.render(basketModel.calcTotalSum());
      basketModel.clear(); // очищаем корзину
      basket.renderHeaderBasketCounter(basketModel.getAmount()); // отобразить количество товара на иконке корзины
      modal.render();
    })
    .catch(error => console.log(error));
});

events.on('success:close', () => modal.close());

// Блокируем прокрутку страницы при открытие модального окна 
events.on('modal:open', () => {
  modal.locked = true;
});

// Разблокируем прокрутку страницы при закрытие модального окна 
events.on('modal:close', () => {
  modal.locked = false;
});

apiModel.getListProductCard()
  .then(function (data: ProductItem[]) {
    dataModel.productCards = data;
  })
  // .then(dataModel.setProductCards.bind(dataModel))
  .catch(error => console.log(error))