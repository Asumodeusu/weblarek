import { AbstractCard } from "./AbstractCard"; 
import { IEvents } from "../../base/Events";
import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils" 

export class CardPreview extends AbstractCard {
    protected description: HTMLElement;
    protected cardButtonElement: HTMLButtonElement;
    private currentProduct: IProduct | null = null;

    constructor(protected events: IEvents) {
      super(events, '#card-preview');
      this.description = ensureElement<HTMLElement>('.card__text', this.container);
      this.cardButtonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);
      this.cardButtonElement.addEventListener('click', () => {
      if (this.currentProduct) {
        this.events.emit('card:toggle', this.currentProduct);
        }
      });
    }

    render(product: IProduct): HTMLElement {
      this.currentProduct = product;
      this.renderBase(product);
      this.description.textContent = product.description;

      if (product.price === null) {
        this.cardButtonElement.setAttribute('disabled', 'true');
        this.cardButtonElement.textContent = 'Недоступно';
      } else {
        this.cardButtonElement.removeAttribute('disabled');
        this.cardButtonElement.textContent = 'Купить';
      }
      return this.container;
    }

    setInBasket(inBasket: boolean): void {
      if (this.cardButtonElement.getAttribute('disabled') !== 'true') {
        this.cardButtonElement.textContent = inBasket ? 'Удалить из корзины' : 'Купить';
    }
  }
}