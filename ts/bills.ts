import {HTTP} from "./http";
import {ServiceProviderOverlay} from "./service_provider";
import {BillOverlay} from "./bill";


const addService = document.getElementById("addService");

addService.addEventListener("click", (event: Event) => {
  const overlay = new ServiceProviderOverlay("Add Service Provider");
  overlay.generateModal();
  overlay.generateForm("/serivce-providers");
  overlay.create();
}, false);

const addBill = document.getElementById("addBill");

addBill.addEventListener("click", (event: Event) => {
  const overlay = new BillOverlay("Add Bill");
  overlay.generateModal();
  overlay.generateForm("/serivce-providers");
  overlay.create();
}, false);

document.addEventListener("DOMContentLoaded", (event: Event) => {
  HTTP.get("/bills").then((data) => {
    const tranTable = document.querySelector("#bills tbody");
    const transactions = JSON.parse(data as string);
    
    for (let transaction of transactions) {
      const row = document.createElement("tr");
      const service = document.createElement("td")
      const dueDate = document.createElement("td");
      const amount = document.createElement("td");
      const pdf = document.createElement("td");
      const paymentStatus = document.createElement("td");
      const options = document.createElement("td");
      const dropdown = document.createElement("span");

      const fields = [];

      service.textContent = transaction["service_provider_id"];
      dueDate.textContent = transaction["due_date"];
      const amountOwed: number = parseFloat(transaction["amount_owed"]);
      const amountPaid: number = parseFloat(transaction["amount_paid"]);
      const finalAmount = amountOwed - amountPaid;
      amount.textContent = finalAmount.toFixed(2);


      paymentStatus.textContent = transaction["payment_status_id"];

      pdf.textContent = "None";
      pdf.className = "center-text";

      dropdown.className = "material-icons drop-options";
      dropdown.textContent = "more_horiz";
      options.className = "center_text";
      options.colSpan = 2;
      options.appendChild(dropdown);

      fields.push(service)
      fields.push(dueDate);
      fields.push(amount);
      fields.push(paymentStatus);
      fields.push(pdf);
      fields.push(options);

      for (let field of fields as any) {
        row.appendChild(field);
      }

      tranTable.appendChild(row);
    }
  });
});
})