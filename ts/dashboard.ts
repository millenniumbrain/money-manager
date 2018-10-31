import {HTTP} from "./http";
import {TransactionOverlay} from "./transaction";
import {AccountOverlay} from "./account"
import * as Chart from "chart.js";

const addTransaction = document.getElementById("addTransaction");

addTransaction.addEventListener("click", (event: Event) => {
  console.log("Cool Math")
  const overlay = new TransactionOverlay("Add Transaction");
  overlay.generateModal();
  overlay.generateForm("/transactions");
  overlay.create();
})

const addAccount = document.getElementById("addAccount");

addAccount.addEventListener("click", (event: Event) => {
  const addAccounts = new AccountOverlay("Add Account");
  addAccounts.generateModal();
  addAccounts.generateForm("/accounts");
  addAccounts.create();
});

const accountName = document.getElementById("accountName");

document.addEventListener("DOMContentLoaded", () => {
  HTTP.get("/accounts").then((data) => {
    const name = document.createElement("span");
    const accounts = JSON.parse(data as string);
    name.textContent = accounts[0]["name"];
    accountName.insertBefore(name, accountName.firstChild);
  });

  HTTP.get("/transactions").then((data) => {
    const tranTable = document.querySelector("#transactions tbody");
    const transactions = JSON.parse(data as string);
    
    for (let transaction of transactions) {
      const row = document.createElement("tr");
      const date = document.createElement("td");
      const amount = document.createElement("td");
      const desc = document.createElement("td");
      const account_name = document.createElement("td");
      const category = document.createElement("td");
      const options = document.createElement("td");
      const dropdown = document.createElement("span");

      const fields = [];

      date.textContent = transaction["date"];
      
      if (transaction["type"] === "income") {
        amount.textContent = `+ ${transaction["amount"]}`;
        amount.className = "income";
      } else {
        amount.textContent = `- ${transaction["amount"]}`;
        amount.className = "expense";
      }
      
      desc.textContent = transaction["desc"];
      desc.className = "center-text";
      account_name.textContent = transaction["account_name"];
      category.textContent = "None";

      dropdown.className = "material-icons";
      dropdown.textContent = "more_horiz";
      options.className = "center_text";
      options.appendChild(dropdown);

      fields.push(date);
      fields.push(amount);
      fields.push(desc);
      fields.push(account_name);
      fields.push(category);
      fields.push(options);

      for (let field of fields) {
        row.appendChild(field);
      }

      tranTable.appendChild(row);
    }
  })
});

const categoryCTX = document.getElementById("categoryPie");
const doughnut = new Chart(categoryCTX as any, {
    type: 'doughnut',
    data: {
        labels: ["Food", "Electronics", "Gaming"],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 1
        }]
    },
    options: {
      responsive: true,
      legend: {
        position: 'left',
      },
      animation: {
        animateScale: true,
        animateRotate: true
      }
    }
});

const balanceCTX = document.getElementById("balanceHistory");
const balanceHistory = new Chart(balanceCTX as any, {
  type: 'line',
  data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [{
          label: 'Income',
          data: [200,  50, 450, 75, 125, 150],
          backgroundColor: [
              'rgba(0, 230, 64, 0.1)',
          ],
          pointRadius: 0,
          borderColor: [
              'rgba(0, 230, 64, 1)',
          ],
          borderWidth: 1
      },
      {
        label: 'Expense',
        data: [300,  25, 200, 0, 0, 250],
        backgroundColor: [
            'rgba(255, 99, 132, 0.1)',
        ],
        pointRadius: 0,
        borderColor: [
            'rgba(255,99,132,1)',
        ],
        borderWidth: 1
    }
    ]
  },
  options: {
    responsive: true,
    legend: {
      position: 'top',
    },
    animation: {
      animateScale: true,
      animateRotate: true
    },
    layout: {
      padding: {
        left: 60,
        right: 60,
        bottom: 30,
        top: 10
      }
    },
    scales: {
      xAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Month'
        }
      }],
      yAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Dollars (USD)'
        }
      }]
    }
  }
});