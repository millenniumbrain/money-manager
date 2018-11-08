import {Overlay} from "./overlay";
import {HTTP} from "./http";
//import { DateTime } from "luxon";
declare var luxon;
const DateTime = luxon.DateTime;

export class TransactionOverlay extends Overlay {
  public form: HTMLFormElement;

  constructor(title: string) {
    super(title)
  }

  public generateModal() {
    super.generateModal();
  }


  public getCategories() {

  }

  public generateForm = (actionUrl: string) : void => {
    this.form = document.createElement("form");
    this.form.id = "newTransaction"
    this.form.className = "pure-form pure-form-stacked";

    const fieldset = document.createElement("fieldset");
    const date = document.createElement("input");
    const type = document.createElement("select");
    const amount = document.createElement("input");
    const accounts = document.createElement("select");
    const desc = document.createElement("textarea");
    const submit = document.createElement("button");

    date.name = "date";
    type.name = "type";
    amount.name = "amount";
    accounts.name = "account";
    desc.name = "desc";
    
    date.value = DateTime.local().toLocaleString(DateTime.DATE_MED);
    submit.className = "pure-button pure-button-primary";
    submit.textContent = "Add Transaction";
    submit.type = "submit";
    
    const fields = [];
    
    const typeOpts = ["income", "expense"];
    for (let i = 0; i < typeOpts.length; i++) {
      const typeOpt = document.createElement("option");
      typeOpt.value = typeOpts[i];
      typeOpt.textContent = typeOpts[i][0].toUpperCase() + typeOpts[i].slice(1);
      type.appendChild(typeOpt);
    }

    HTTP.get("/accounts").then((data) => {
      const accountList = JSON.parse(data as string);
      console.log(accountList)
      for(let i = 0; i < accountList.length; i++) {
        const option = document.createElement("option");
        console.log(accountList[i]["name"])
        option.textContent = accountList[i]["name"];
        option.value = accountList[i]["id"]
        accounts.appendChild(option);
      }
    });

    fields.push(date);
    fields.push(type);
    fields.push(amount);
    fields.push(accounts);
    fields.push(desc);
    fields.push(submit);

    const labels = ["Date", "Type", "Amount", "Accounts", "Description"];
    for (let i = labels.length - 1; i >= 0; i--) {
      const label = document.createElement("label");
      label.textContent = labels[i];
      fields.splice(i, 0, label);
    }
    
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

      HTTP.post("/transactions", formData);
    })


  }

}