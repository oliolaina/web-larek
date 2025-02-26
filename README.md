# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура

Архитектура приложения представляет собой MVP (Model-View-Presenter) паттерн. В нём приложение делится на три компонента:

### 1. Model (Модель) работает с данными, проводит вычисления и руководит всеми бизнес-процессами.

Основные данные, которые используются для логики работы приложения:

Товар со следующими свойствами:
- идентификатор
- подробное описание
- ссылка на изображение
- заголовок
- категория
- цена товара

Данные о пользователе:
- адрес
- почта
- телефон
- тип оплаты
  
### 2. View (Вид или представление) показывает пользователю интерфейс и данные из модели.

* __Главное окно каталога__ содержит карточки товаров и кнопку корзины

* __Попап карточки товара__ содержит информацию о карточке, кнопку 'В корзину' и кнопку закрытия попапа

* __Модальное окно корзины__ содержит список выбранных товаров, а также позволяет удалять товары или оформить заказ соответствующей кнопкой

* __Модальное окно оформления заказа__ содержит выбор способа оплаты, ввод адреса доставки, кнопку 'Далее'для продолжения оформления и кнопку закрытия окна

* __Модальное окно контактной информации,__ содержит окна ввода почты, телефона, кнопку 'Оплатить' и кнопку закрытия окна

* __Модальное окно заказа после оформления__ содержит кнопку выходас надписью 'За новыми покупками!'

### 3. Presenter (Представитель) служит прослойкой между моделью и видом.

Для реализации прослойки между первыми двумя слоями будет использован брокер событий. Он реализует принцип выдачи сигнала слушателям при наступлении определенного события.
Например, нажатие на кнопку "В корзину" в попапе товара вызывает событие добавления товара в корзину.

## Ключевые типы данных
```
export type ProductItem = {
    id: string,
    description: string,
    image: string,
    title: string
    category: Category,
    price: number | null
}

export type ProductList = {
    total: number,
    items: ProductItem[]
}

export type Order = {
    id: string,
    total: number
}

export type UserInfo = {
    payment: PaymentType,
    address: string,
    email: string,
    phone: string
}

export interface IUser {
    __info: UserInfo;
    constructor(): void;
    setPaymentType(payment: PaymentType): void;
    setAddress(address: string): void;
    setEmail(email: string): void;
    setPhone(phone: string): void;
    resetAll(): void;
} 

export interface IProductCollection {
    __amount: number;
    __items: ProductItem[];
    getItems(): ProductItem[];
    isEmpty(): boolean;
}

export interface ICatalog extends IProductCollection {
    constructor(products?: ProductList): void;
    refill(products: ProductList): void;
}

export interface IBusket extends IProductCollection {
    constructor(): void;
    add(): void;
    remove(id: string): void;
    clear(): void;
    calcTotalSum(): number;
}

export type EventName = string | RegExp;
export type Subscriber = Function;

export type EmitterEvent = {
    eventName: EventName,
    data: unknown
};

export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

export interface IView {
    _content: HTMLElement;

    constructor(content: HTMLElement): void;
    render(data?: object): HTMLElement;
}

export type BuyButtonState = 'disabled' | 'already' | 'able';

export interface ICard extends IView {
    _data: ProductItem;

    setProduct(data: ProductItem): void;    
}

export interface IBusketItem extends ICard {
    onRemove(): void;
}

export interface IModal extends IView {
    onOpen(): void;
    onClose(): void;
}

export type FormError = 'address' | 'email' | 'phone'

export interface IForm {
    __isValid: boolean;
    _content: HTMLElement;
    _errors: FormError[];    
    checkValidity(): boolean;
    getErrors(): FormError[];
}

export interface IModalForm extends IModal {
    form: IForm;
}

```
