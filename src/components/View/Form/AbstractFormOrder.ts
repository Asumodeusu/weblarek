import { cloneTemplate, ensureElement, ensureAllElements } from "../../../utils/utils" 
import { Component } from "../../base/Component" 
import { IEvents } from "../../base/Events"

export abstract class AbstractFormOrder extends Component<HTMLElement> {
    protected formSubmitButtonElement: HTMLButtonElement;
    protected formErrorsElement: HTMLElement;
    protected formTitleElements: HTMLElement[];

    constructor(protected events: IEvents, template: string, protected submitEvent: string) {
        super(cloneTemplate<HTMLFormElement>(template));
        this.formSubmitButtonElement = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
        this.formErrorsElement = ensureElement<HTMLElement>('.form__errors', this.container);
        this.formTitleElements = ensureAllElements<HTMLElement>('.modal__title', this.container);
        
        this.container.addEventListener('submit', (event: Event) => {
            event.preventDefault();
            this.events.emit(this.submitEvent);
        });
    }

    setErrors(message: string): void { // открыл для передачи в маин
        this.formErrorsElement.textContent = message;
    }

    setSubmitEnabled(enabled: boolean): void {
        this.formSubmitButtonElement.disabled = !enabled;
    }

    clearErrors(): void {
        this.formErrorsElement.textContent = '';
    }
}