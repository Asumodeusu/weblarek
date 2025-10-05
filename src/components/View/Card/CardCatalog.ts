import { AbstractCard } from "./AbstractCard";
import { IEvents } from "../../base/Events";
import { IProduct } from "../../../types";

export class CardCatalog extends AbstractCard {
  constructor(protected events: IEvents) {
    super(events, '#card-catalog');
  }

  render(product: IProduct): HTMLElement {
    this.renderBase(product);
        this.container.addEventListener('click', () => {
        this.events.emit('card:select', product);
        });
    return this.container;
  }
}
