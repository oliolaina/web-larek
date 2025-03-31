
// Слой модели (Model)

export type PaymentType = 'Онлайн' | 'При получении' | ''
export type OrderInfo = UserInfo & ProductList

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

//хранилище товаров
export interface IProductCollection {
    getAmount: () => number;
    basketProducts: ProductItem[];
}

export interface ICatalog {
    productCards: ProductItem[];
    selectedСard: ProductItem;
    open(item: ProductItem): void;
}

export interface IBasket extends IProductCollection {
    add(data: ProductItem): void;
    remove(item: ProductItem): void;
    clear(): void;
    calcTotalSum(): number;
}



export type ProductItem = {
    id: string,
    description: string,
    image: string,
    title: string
    category: Category,
    price: number | null,
    inBasket?: boolean | null
}

export type Category = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';

export type ProductList = {
    total: number,
    items: string[]
}

export type Order = {
    id: string,
    total: number
}

export type ErrorResponse = {
    error: string
}


export interface IUserInfoModel extends UserInfo, ProductList {
    setOrderAddress(field: string, value: string): void
    validateOrder(): boolean;
    setOrderData(field: string, value: string): void
    validateContacts(): boolean;
    getOrderLot(): object;
  }


export interface IApiModel {
    cdn: string;
    items: ProductItem[];
    getListProductCard: () => Promise<ProductItem[]>;
    postOrderLot: (order: OrderInfo) => Promise<Order>;
  }


export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
export type GetProductItemResponse = ProductList | ErrorResponse;

// Слой Presenter - брокер событий

export type EventName = string;
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



// Слой представления - View

export interface IView {// Базовый интерфейс для представления
    _content: HTMLElement;
    constructor(content: HTMLElement): void;
    render(data?: object): HTMLElement;
}

export interface ICard extends IView {// Интерфейс для карточки товара
    _data: ProductItem;

    setProduct(data: ProductItem): void;    
}

export interface IBasketItem extends ICard {// Интерфейс для элемента корзины
    onRemove(): void;
}

export interface IModal extends IView {// Интерфейс для модального окна
    onOpen(): void;
    onClose(): void;
}

export interface IForm {// Интерфейс для формы
    __isValid: boolean;
    _content: HTMLElement;
    _errors: FormError[];
    
    checkValidity(): boolean;
    getErrors(): FormError[];
}

export interface IModalForm extends IModal {// Интерфейс для модального окна с формой
    form: IForm;
}

export type FormError = Partial<Record<keyof OrderInfo, string>>;
export type BuyButtonState = 'disabled' | 'able';


