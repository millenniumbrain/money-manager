import {Overlay} from "./overlay";
import {HTTP} from "./http";

declare var luxon;
const DateTime = luxon.DateTime;

export class BillOverlay extends Overlay {
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
    this.form.id = "newBill";
    
    const fieldset = document.createElement("fieldset");
    const dueDate = document.createElement("input");
    const amountOwed = document.createElement("input");
    const amountPaid = document.createElement("input");
    const uploadCon = document.createElement("div");
    const billPDF = document.createElement("input");
    const notes = document.createElement("textarea");
    const submit = document.createElement("button");
    
    const labels = ["Due Date", "Amount Owed", "Amount Paid", "Add File", "Notes"];
    const fields = [];

    dueDate.name = "due_date";
    dueDate.type = "text";
    dueDate.value = DateTime.local().toLocaleString(DateTime.DATE_MED);

    amountOwed.name = "amount_owed";
    amountOwed.type = "text";
    amountOwed.value = "0.00";
    amountPaid.name = "amount_paid";
    amountPaid.value = "0.00";
    amountPaid.type = "text";

    uploadCon.className = "upload-con";
    billPDF.name = "bill_file";
    billPDF.type = "file";
    uploadCon.appendChild(billPDF);
    notes.name = "notes";

    submit.className = "pure-button pure-button-primary";
    submit.textContent = "Add Bill";
    submit.type = "submit";

    fields.push(dueDate);
    fields.push(amountOwed);
    fields.push(amountPaid);
    fields.push(uploadCon);
    fields.push(notes);
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

      HTTP.post("/bills", formData);
    })
  }
}