// Хранение товаров, которые пользователь выбрал для покупки

import { IProduct } from "../../../types/index";
import { EventEmitter } from "../../base/Events";

export class Basket {
  private ProductBuyer: IProduct[] = [];

  constructor(private events: EventEmitter) {}

  getProducts(): IProduct[] {
    return this.ProductBuyer;
  } // получение массива товаров, которые находятся в корзине;

  addProduct(product: IProduct) {
    this.ProductBuyer.push(product);
    this.events.emit('basket:changed');
  } // добавление товара, который был получен в параметре в массив корзины;

  removeProduct(productId: string): void {
    this.ProductBuyer = this.ProductBuyer.filter(
      (product) => product.id !== productId
    );
    this.events.emit('basket:changed');
  } // удаление товара, полученного в параметре из массива корзины;

  clearBasket() {
    this.ProductBuyer = [];
    this.events.emit('basket:changed'); 
  } // очистка корзины;

  getTotalPrice(): number {
    return this.ProductBuyer.reduce((sum, product) => {
      return sum + (product.price || 0);
    }, 0);
  } // получение стоимости всех товаров в корзине;

  getTotalProduct(): number {
    return this.ProductBuyer.length;
  } // получение количества товаров в корзине;

  hasProductBasket(id: string): boolean {
    return this.ProductBuyer.some((product) => product.id === id);
  } // проверка наличия товара в корзине по его id, полученному в параметр метода.
}
