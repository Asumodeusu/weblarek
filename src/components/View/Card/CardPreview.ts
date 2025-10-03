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
      this.CardButtonElement.addEventListener('click', () => {
      this.events.emit('card:toggle', product);
      });
      return this.container;
    }

    setInBasket(inBasket: boolean): void {
    this.CardButtonElement.textContent = inBasket ? 'Удалить из корзины' : 'В корзину';
    }
}