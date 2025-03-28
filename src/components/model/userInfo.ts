import { ApiListResponse, Api } from '../base/api'
import { OrderInfo, Order, ProductItem } from '../../types';

export class ApiModel extends Api {
  cdn: string;
  items: ProductItem[];

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  // получение карточек с сервера
  getListProductCard(): Promise<ProductItem[]> {
    return this.get('/product').then((data: ApiListResponse<ProductItem>) =>
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image,
      }))
    );
  }

  // ответ от сервера по совершённому заказу
  postOrderLot(order: OrderInfo): Promise<Order> {
    return this.post(`/order`, order).then((data: Order) => data);
  }
}