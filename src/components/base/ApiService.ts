import { Api } from "./Api";
import { IProduct, IOrder, IOrderResult } from "../../types";

export class ApiService extends Api {
  constructor(baseUrl: string, options: RequestInit = {}) {
    super(baseUrl, options); // добавил инциализацию
  }

  getProducts(): Promise<IProduct[]> {
    return this.get<IProduct[]>("/product/");
  } // получение массива товаров

  createOrder(order: IOrder): Promise<IOrderResult> {
    return this.post<IOrderResult>("/order/", order);
  } // отправка заказа
}
