import {Overlay} from "./overlay";
import {HTTP} from "./http";

export class ServiceProviderOverlay extends Overlay {
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
    const serviceName = document.createElement("input");
    const periodOpt1 = document.createElement("label");
    const periodOpt1Txt = document.createElement("span")
    const periodOpt1Radio = document.createElement("input");
    const periodOpt2 = document.createElement("label");
    const periodOpt2Txt = document.createTextNode("span");
    const periodOpt2Radio = document.createElement("input");
    const submit = document.createElement("button");
    
    const labels = ["Name", "Billing Period"];
    const fields = [];

    serviceName.name = "service_name";
    periodOpt1.className = "pure-radio"

    periodOpt2.className = "pure-radio";

    periodOpt1Radio.type = "radio"
    periodOpt1Radio.name = "billing_period";
    periodOpt1Radio.value = "monthly";
    periodOpt2Radio.type = "radio";
    periodOpt2Radio.name = "billing_period";
    periodOpt2Radio.value = "annual";
    periodOpt1Txt.textContent = "Monthly";
    periodOpt2Txt.textContent = "Annual";

    periodOpt1.appendChild(periodOpt1Radio);
    periodOpt1.appendChild(periodOpt1Txt);
    periodOpt2.appendChild(periodOpt2Radio);
    periodOpt2.appendChild(periodOpt2Txt);
    

    submit.className = "pure-button pure-button-primary";
    submit.textContent = "Add Service";
    submit.type = "submit";

    fields.push(serviceName);
    fields.push(periodOpt1);
    fields.push(periodOpt2);
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