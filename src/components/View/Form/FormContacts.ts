import { ensureElement } from "../../../utils/utils" 
import { IEvents } from "../../base/Events"
import { AbstractFormOrder } from "./AbstractFormOrder";

export class FormContacts extends AbstractFormOrder {
    protected formEmailInputElement: HTMLInputElement;
    protected formTelephoneInputElement: HTMLInputElement;

    constructor(protected events: IEvents) {
      super(events, '#contacts', 'contacts:submit');
      this.formEmailInputElement = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
      this.formTelephoneInputElement = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
      
      this.formEmailInputElement.addEventListener('input', () => {
        this.events.emit('contacts:email', { value: this.formEmailInputElement.value });
      });
    

    this.formTelephoneInputElement.addEventListener('input', () => {
      this.events.emit('contacts:phone', { value: this.formTelephoneInputElement.value });
      });
  }
}
