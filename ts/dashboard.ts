import {HTTP} from "./http";
import {TransactionOverlay} from "./transaction";

const addTransaction = document.getElementById("addTransaction");

addTransaction.addEventListener("click", (event: Event) => {
  const newTransaction = new TransactionOverlay("New Transaction")
})