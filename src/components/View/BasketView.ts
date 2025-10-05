import { ensureElement } from "../../utils/utils" 
import { Component } from "../base/Component" 
import { IEvents } from "../base/Events"

interface IBasketData {
  items: HTMLElement[];
  total: number;
}

export class BasketView extends Component<IBasketData> {
  protected basketTitleElement: HTMLElement;
  protected basketListElement: HTMLElement;
  protected basketButtonOrderElement: HTMLButtonElement;
  protected basketPriceElement: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container)
    this.basketTitleElement = ensureElement<HTMLElement>('.modal__title', this.container);
    this.basketListElement = ensureElement<HTMLElement>('.basket__list', this.container);  
    this.basketButtonOrderElement = ensureElement<HTMLButtonElement>('.basket__button', this.container);  
    this.basketPriceElement = ensureElement<HTMLElement>('.basket__price', this.container);  
  
    this.basketButtonOrderElement.addEventListener('click', () => {
    this.events.emit('basket:order');
    });
  }
  
    set items(value: HTMLElement[]) {
    if (value.length === 0) {
      this.basketListElement.innerHTML = 'Корзина пуста';
      this.basketButtonOrderElement.disabled = true;
    } else {
      this.basketListElement.replaceChildren(...value);
      this.basketButtonOrderElement.disabled = false;
    }
}
    set total(value: number) {
      this.basketPriceElement.textContent = `${value} синапсов`;
    }
}