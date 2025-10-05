import { Component } from "../base/Component" 
import { IEvents } from "../base/Events";
import { IProduct } from "../../types";
import { ensureElement, cloneTemplate } from "../../utils/utils" 

export class CardBasket extends Component<IProduct & { index?: number }> {
    protected title: HTMLElement;
    protected price: HTMLElement;
    protected CardIndexElement: HTMLElement;
    protected CardButtonRemoveElement: HTMLButtonElement;

    constructor(protected events: IEvents) {
     super(cloneTemplate<HTMLElement>('#card-basket'));
      this.title = ensureElement<HTMLElement>('.card__title', this.container);
      this.price = ensureElement<HTMLElement>('.card__price', this.container);
      this.CardIndexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
      this.CardButtonRemoveElement = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
    }

    render(product: IProduct & { index?: number }): HTMLElement {
      this.title.textContent = product.title;
      this.price.textContent = product.price ? `${product.price} синапсов` : 'Бесценно';
      this.CardIndexElement.textContent = String((product.index || 0) + 1);
      this.CardButtonRemoveElement.addEventListener('click', () => {
      this.events.emit('card:remove', product);
      });
      return this.container;
    }
}