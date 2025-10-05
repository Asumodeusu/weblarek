import { cloneTemplate, ensureElement, ensureAllElements } from "../../../utils/utils" 
import { Component } from "../../base/Component" 
import { IEvents } from "../../base/Events"

export abstract class AbstractFormOrder extends Component<HTMLElement> {
    //protected formElement: HTMLFormElement;
    protected formSubmitButtonElement: HTMLButtonElement;
    protected formErrorsElement: HTMLElement;
    protected formTitleElements: HTMLElement[];

    constructor(protected events: IEvents, template: string, protected submitEvent: string) {
        super(cloneTemplate<HTMLFormElement>(template));
        //this.formElement = ensureElement<HTMLFormElement>('form', this.container);
        this.formSubmitButtonElement = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
        this.formErrorsElement = ensureElement<HTMLElement>('.form__errors', this.container);
        this.formTitleElements = ensureAllElements<HTMLElement>('.modal__title', this.container);
        
        this.container.addEventListener('submit', (event: Event) => {
            event.preventDefault();
            this.events.emit(this.submitEvent);
        });
    }
    protected setErrors(message: string): void {
        this.formErrorsElement.textContent = message;
    }

    protected setSubmitEnabled(enabled: boolean): void {
        this.formSubmitButtonElement.disabled = !enabled;
    }
}