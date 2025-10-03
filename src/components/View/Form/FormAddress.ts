import { ensureElement, ensureAllElements } from "../../../utils/utils" 
import { IEvents } from "../../base/Events"
import { AbstractFormOrder } from "./AbstractFormOrder";

export class FormAddress extends AbstractFormOrder {
    protected FormPaymentButtonElement: HTMLButtonElement[];
    protected FormAddressInputElement: HTMLInputElement;

    constructor(protected events: IEvents) {
      super(events, '#order', 'order:submit');
      this.FormPaymentButtonElement = ensureAllElements<HTMLButtonElement>('.order__buttons button', this.container);
      this.FormAddressInputElement = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
      // Свои обработчики
      this.FormPaymentButtonElement.forEach(button => {
        button.addEventListener('click', () => {
          this.events.emit('payment:select', { method: button.name });
          });
        });

      this.FormAddressInputElement.addEventListener('input', () => {
        this.events.emit('address:change', { value: this.FormAddressInputElement.value });
        });
    }

      setPaymentSelected(method: string): void {
        this.FormPaymentButtonElement.forEach(button => {
          button.classList.toggle('button_alt-active', button.name === method);
        });
    }
}