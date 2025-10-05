import { Api } from "./Api";
import { IOrder, IOrderResult, IProductsResponse } from "../../types";

export class ApiService extends Api {
  constructor(baseUrl: string, options: RequestInit = {}) {
    super(baseUrl, options); // инициализация конструктора родительского класса
  }

  getProducts(): Promise<IProductsResponse> {
    return this.get("/product/");
  } // получение массива товаров

  createOrder(order: IOrder): Promise<IOrderResult> {
    return this.post("/order/", order);
  } // отправка заказа
}
