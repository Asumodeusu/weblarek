import { cloneTemplate, ensureElement } from "../../../utils/utils" 
import { Component } from "../../base/Component" 
import { IEvents } from "../../base/Events"
import { categoryMap } from "../../../utils/constants";
import { IProduct } from "../../../types";
import { CDN_URL } from "../../../utils/constants";

export abstract class AbstractCard extends Component<IProduct> {
    protected category: HTMLElement;
    protected title: HTMLElement;
    protected image: HTMLImageElement;
    protected price: HTMLElement;

    constructor(protected events: IEvents, template: string) {
      super(cloneTemplate<HTMLElement>(template));
      this.category = ensureElement<HTMLElement>('.card__category', this.container);
      this.title = ensureElement<HTMLElement>('.card__title', this.container);
      this.image = ensureElement<HTMLImageElement>('.card__image', this.container);
      this.price = ensureElement<HTMLElement>('.card__price', this.container);
    }

    // Общая логика заполнения
    protected renderBase(product: IProduct): void {
      this.category.textContent = product.category;
      this.title.textContent = product.title;
      this.category.className = `card__category ${categoryMap[product.category as keyof typeof categoryMap]}`;
      this.price.textContent = product.price ? `${product.price} синапсов` : 'Бесценно';
      this.setImage(this.image, `${CDN_URL}/${product.image}`, product.title);
    }

    // Абстрактный метод - каждый сам решает как рендерить
    abstract render(product: IProduct): HTMLElement;
}
