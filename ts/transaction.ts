import {Overlay} from "./overlay";
import {HTTP} from "./http";

export class TransactionOverlay extends Overlay {
  public form: HTMLFormElement;

  constructor(title: string) {
    super(title)
  }

  public generateModal() {
    super.generateModal();
  }

  public generateForm = (actionUrl: string) : void => {
    this.form = document.createElement("form");
    const fieldset = document.createElement("fieldset");

  }

  public create() {
    super.create();

    this.form.addEventListener("submit", (event: Event) => {
      event.preventDefault();
    })


  }

}