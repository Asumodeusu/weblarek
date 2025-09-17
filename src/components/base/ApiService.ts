import { Api } from "./Api";
import { IProduct, IOrder, IOrderResult } from "../../types";

export class ApiService extends Api {
  constructor(baseUrl: string, options: RequestInit = {}) {
    super(baseUrl, options); // инициализация конструктора родительского класса
  }
  /*Если позволите добавить - то там в тз где-то было написано не использовать екстеденс - поэтому как-то и не подумал)*/

  getProducts(): Promise<IProduct[]> {
    return this.get("/product/");
  } // получение массива товаров

  createOrder(order: IOrder): Promise<IOrderResult> {
    return this.post("/order/", order);
  } // отправка заказа
}
