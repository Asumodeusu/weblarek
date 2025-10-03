import { ensureElement } from "../../../utils/utils" 
import { IEvents } from "../../base/Events"
import { AbstractFormOrder } from "./AbstractFormOrder";

export class FormContacts extends AbstractFormOrder {
    protected FormEmailInputElement: HTMLInputElement;
    protected FormTelephoneInputElement: HTMLInputElement;

    constructor(protected events: IEvents) {
      super(events, '#contacts', 'contacts:submit');
      this.FormEmailInputElement = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
      this.FormTelephoneInputElement = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
      
      this.FormEmailInputElement.addEventListener('input', () => {
        this.events.emit('contacts:email', { value: this.FormEmailInputElement.value });
      });
    

    this.FormTelephoneInputElement.addEventListener('input', () => {
      this.events.emit('contacts:phone', { value: this.FormTelephoneInputElement.value });
      });
  }
}
