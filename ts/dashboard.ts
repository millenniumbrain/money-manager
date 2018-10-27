import {HTTP} from "./http";
import {TransactionOverlay} from "./transaction";

const addTransaction = document.getElementById("addTransaction");

addTransaction.addEventListener("click", (event: Event) => {
  console.log("Cool Math")
  const overlay = new TransactionOverlay("Add Transaction");
  overlay.generateModal();
  overlay.generateForm("/transactions");
  overlay.create();
})