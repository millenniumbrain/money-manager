import {Overlay} from "./overlay";
import {HTTP} from "./http";

export class AccountOverlay extends Overlay {
  public form: HTMLFormElement;

  constructor(title: string) {
    super(title)
  }

  public generateModal() {
    super.generateModal();
  }

  public generateLabels(labels: Array<string>, fields: Array<any>) : any {
    super.generateLabels(labels, fields);
  }

  public generateForm = (actionUrl: string) : void => {
    this.form = document.createElement("form");
    this.form.className = "pure-form pure-form-stacked";

    const fieldset = document.createElement("fieldset");
    const accountName = document.createElement("input");
    const submit = document.createElement("button");
    
    const labels = ["Name"];
    const fields = [];

    accountName.name = "account_name";
    accountName.type = "text";

    submit.className = "pure-button pure-button-primary";
    submit.textContent = "Add Account";
    submit.type = "submit";

    fields.push(accountName);
    fields.push(submit);

    this.generateLabels(labels, fields);
    
    for (let i = 0; i < fields.length; i++) {
      fieldset.appendChild(fields[i]);
    }

    this.form.appendChild(fieldset);
    this.modal.appendChild(this.form);
  }

  public create() {
    super.create();

    this.form.addEventListener("submit", (event: Event) => {
      event.preventDefault();

      const formData = new FormData(this.form);

      HTTP.post("/accounts", formData);
    })
  }
}