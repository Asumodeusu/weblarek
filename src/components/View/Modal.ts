import { ensureElement } from "../../utils/utils" 
import { Component } from "../base/Component" 
import { IEvents } from "../base/Events"

export class Modal extends Component<HTMLElement> {
    protected ModalCloseButtonElement: HTMLButtonElement;
    protected ModalContentElement: HTMLElement;

    constructor(protected events: IEvents) {
      super(ensureElement<HTMLElement>('#modal-container'));
      this.ModalCloseButtonElement = ensureElement<HTMLButtonElement>('.modal__close', this.container);
      this.ModalContentElement = ensureElement<HTMLElement>('.modal__content', this.container);  

      this.ModalCloseButtonElement.addEventListener('click', () => {
        this.close()
    })
    
      this.container.addEventListener('click', (event: MouseEvent) => {
        if (event.target === this.container) this.close()
    })
  }

    open(content: HTMLElement) {
      this.ModalContentElement.replaceChildren(content)
      this.container.classList.add('modal_active')
  }

    close() {
      this.container.classList.remove('modal_active')
      this.ModalContentElement.innerHTML = ''
  }
}