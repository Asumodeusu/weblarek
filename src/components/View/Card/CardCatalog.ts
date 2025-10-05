import { AbstractCard } from "./AbstractCard";
import { IEvents } from "../../base/Events";
import { IProduct } from "../../../types";

export class CardCatalog extends AbstractCard {
  private currentProduct: IProduct | null = null; // указал в каждом классе дочернем отдельно

  constructor(protected events: IEvents) {
    super(events, '#card-catalog');

    this.container.addEventListener('click', () => {
    if (this.currentProduct) {
      this.events.emit('card:select', this.currentProduct);
      }
    });
  } 

  render(product: IProduct): HTMLElement { 
    this.currentProduct = product;
    this.renderBase(product);
    return this.container; 
  } 
}
