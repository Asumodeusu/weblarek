// Хранение товаров, которые пользователь выбрал для покупки

import { IProduct } from "../../../types/index";

export class Basket {
  private ProductBuyer: IProduct[] = [];

  getProducts(): IProduct[] {
    return this.ProductBuyer;
  } // получение массива товаров, которые находятся в корзине;

  addProduct(product: IProduct) {
    this.ProductBuyer.push(product);
  } // добавление товара, который был получен в параметре в массив корзины;

  removeProduct(productId: string): void {
    this.ProductBuyer = this.ProductBuyer.filter(
      (product) => product.id !== productId
    );
  } // удаление товара, полученного в параметре из массива корзины;

  clearBasket() {
    this.ProductBuyer = [];
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
