import { Api } from "./Api";
import { IProduct, IOrder, IOrderResult } from "../../types";

export class ApiService {
  private api: Api;

  constructor(baseUrl: string, options: RequestInit = {}) {
    this.api = new Api(baseUrl, options);
  }

  getProducts(): Promise<IProduct[]> {
    return this.api.get("/product/");
  } // получение массива товаров

  createOrder(order: IOrder): Promise<IOrderResult> {
    return this.api.post("/order/", order);
  } // отправка заказа
}
