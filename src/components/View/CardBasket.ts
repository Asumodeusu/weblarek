import { Component } from "../base/Component" 
import { IEvents } from "../base/Events";
import { IProduct } from "../../types";
import { ensureElement, cloneTemplate } from "../../utils/utils" 

export class CardBasket extends Component<IProduct & { index?: number }> {
    protected title: HTMLElement;
    protected price: HTMLElement;
    protected cardIndexElement: HTMLElement;
    protected cardButtonRemoveElement: HTMLButtonElement;
    private currentProduct: (IProduct & { index?: number }) | null = null;

    constructor(protected events: IEvents) {
     super(cloneTemplate<HTMLElement>('#card-basket'));
      this.title = ensureElement<HTMLElement>('.card__title', this.container);
      this.price = ensureElement<HTMLElement>('.card__price', this.container);
      this.cardIndexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
      this.cardButtonRemoveElement = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
      this.cardButtonRemoveElement.addEventListener('click', () => {
        if (this.currentProduct) {
          this.events.emit('card:remove', this.currentProduct);
        }
      });
    }

    render(product: IProduct & { index?: number }): HTMLElement {
      this.currentProduct = product;
      this.title.textContent = product.title;
      this.price.textContent = product.price ? `${product.price} синапсов` : 'Бесценно';
      this.cardIndexElement.textContent = String((product.index || 0) + 1);
      return this.container;
    }
}
