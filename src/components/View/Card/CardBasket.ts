import { AbstractCard } from "./AbstractCard";
import { IEvents } from "../../base/Events";
import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils" 

export class CardBasket extends AbstractCard {
    protected CardIndexElement: HTMLElement;
    protected CardButtonRemoveElement: HTMLButtonElement;

    constructor(protected events: IEvents) {
      super(events, '#card-basket');
      this.CardIndexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
      this.CardButtonRemoveElement = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
    }

    render(product: IProduct & { index?: number }): HTMLElement {
      this.renderBase(product);
      this.CardIndexElement.textContent = String((product.index || 0) + 1);
      this.CardButtonRemoveElement.addEventListener('click', () => {
      this.events.emit('card:remove', product);
      });
      return this.container;
    }
}