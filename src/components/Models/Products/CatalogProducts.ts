// Хранение товаров, которые можно купить в приложении

import { IProduct } from "../../../types/index";
import { EventEmitter } from "../../base/Events";

export class CatalogProducts {
  private AllProducts: IProduct[] = [];
  private SelectedProduct: IProduct | null = null;

  constructor(private events: EventEmitter) {}

  setProducts(products: IProduct[]) {
    this.AllProducts = products;
    this.events.emit('catalog:changed');
  } // сохранения массива товаров полученного в параметрах метода;

  getProducts(): IProduct[] {
    return this.AllProducts;
  } // получение массива товаров из модели;

  getProductById(id: string) {
    let productById: IProduct | undefined;
    this.AllProducts.forEach((product) => {
      if (product.id === id) {
        productById = product;
      }
    });
    return productById;
  } // получение одного товара по его id;

  setSelectedProduct(products: IProduct) {
    this.SelectedProduct = products;
    this.events.emit('product:selected', products);
  } // сохранения товара для подробного отображения;

  getSelectedProduct(): IProduct | null {
    return this.SelectedProduct;
  } // получение товара для подробного отображения;
}
