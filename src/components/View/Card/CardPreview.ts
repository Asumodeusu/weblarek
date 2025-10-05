import { AbstractCard } from "./AbstractCard"; 
import { IEvents } from "../../base/Events";
import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils" 

export class CardPreview extends AbstractCard {
    protected description: HTMLElement;
    protected CardButtonElement: HTMLButtonElement;

    constructor(protected events: IEvents) {
      super(events, '#card-preview');
      this.description = ensureElement<HTMLElement>('.card__text', this.container);
      this.CardButtonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);
    }

    render(product: IProduct): HTMLElement {
      this.renderBase(product);
      this.description.textContent = product.description;

      if (product.price === null) {
        this.CardButtonElement.setAttribute('disabled', 'true');
        this.CardButtonElement.textContent = 'Недоступно';
      } else {
        this.CardButtonElement.removeAttribute('disabled');
        this.CardButtonElement.textContent = 'Купить';
      }

      this.CardButtonElement.addEventListener('click', () => {
      this.events.emit('card:toggle', product);
      });
      return this.container;
    }

    setInBasket(inBasket: boolean): void {
      if (this.CardButtonElement.getAttribute('disabled') !== 'true') {
        this.CardButtonElement.textContent = inBasket ? 'Удалить из корзины' : 'Купить';
    }
  }
}