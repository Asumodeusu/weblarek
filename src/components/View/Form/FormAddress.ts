import { ensureElement, ensureAllElements } from "../../../utils/utils" 
import { IEvents } from "../../base/Events"
import { AbstractFormOrder } from "./AbstractFormOrder";

export class FormAddress extends AbstractFormOrder {
    protected formPaymentButtonElement: HTMLButtonElement[];
    protected formAddressInputElement: HTMLInputElement;

    constructor(protected events: IEvents) {
      super(events, '#order', 'order:submit');
      this.formPaymentButtonElement = ensureAllElements<HTMLButtonElement>('.order__buttons button', this.container);
      this.formAddressInputElement = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
      this.formPaymentButtonElement.forEach(button => {
        button.addEventListener('click', () => {
          this.events.emit('payment:select', { method: button.name });
          });
        });

      this.formAddressInputElement.addEventListener('input', () => {
        this.events.emit('address:change', { value: this.formAddressInputElement.value });
        });
    }

      setPaymentSelected(method: string): void {
        this.formPaymentButtonElement.forEach(button => {
          button.classList.toggle('button_alt-active', button.name === method);
        });
    }
}