import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { CardCatalog } from "./Card/CardCatalog";
import { IProduct } from "../../types";

export class Gallery extends Component<{ items: IProduct[] }> {
  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
  }

  render(data?: { items: IProduct[] }): HTMLElement {
    this.container.innerHTML = "";

    data?.items?.forEach((product) => {
      const card = new CardCatalog (this.events).render(product);
      this.container.appendChild(card);
    });

    return this.container;
  }
}