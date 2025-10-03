import { IOrderResult } from "../../types";
import { ensureElement } from "../../utils/utils" 
import { Component } from "../base/Component" 
import { IEvents } from "../base/Events"


export class Success extends Component<IOrderResult> {
  protected orderTitleElement: HTMLElement;
  protected description: HTMLElement;
  protected orderButtonCloseElement: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container)
    this.orderTitleElement = ensureElement<HTMLElement>('.order-success__title', this.container);
    this.description = ensureElement<HTMLElement>('.order-success__description', this.container);  
    this.orderButtonCloseElement = ensureElement<HTMLButtonElement>('.order-success__close', this.container);  

    this.orderButtonCloseElement.addEventListener('click', () => {
    this.events.emit('success:close');
    });
  }
    set total(value: number) {
      this.description.textContent = `Списано ${value} синапсов`;
    }
}