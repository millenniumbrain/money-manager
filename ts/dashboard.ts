import {HTTP} from "./http";
import {TransactionOverlay} from "./transaction";
import {AccountOverlay} from "./account"
//import * as Chart from "chart.js";
declare var Chart;

const addTransaction = document.getElementById("addTransaction");

addTransaction.addEventListener("click", (event: Event) => {
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

const accountName = document.getElementById("accounts");

document.addEventListener("DOMContentLoaded", () => {
  HTTP.get("/accounts").then((data) => {
    const name = document.getElementById("accountName");
    const accounts = JSON.parse(data as string);
    name.textContent = accounts[0]["name"];
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
  });
});

const categoryCTX = document.getElementById("categoryPie");
const pieOpts = {
  type: 'doughnut',
  data: {
      labels: ["Food", "Electronics", "Gaming"],
      datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 6, 7],
          backgroundColor: [],
          borderWidth: 1
      }]
  },
  
  options: {
    responsive: true,
    legend: {
      position: 'left',
    },
    layout: {
      padding: {
        left: 20,
        right: 20,
        bottom: 0,
        top: 0
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true
    }
  }
};


Chart.defaults.global.defaultFontFamily = "'Nunito', sans-serif";
Chart.defaults.global.defaultFontSize = 14;
const colors = [
  "#BEC0C1",
  "#980B12",
  "#DD141C",
  "#55211C",
  "#A3A442",
  "#DD4F4B",
]

pieOpts.data.datasets[0].backgroundColor = colors;

const doughnut = new Chart(categoryCTX as any, pieOpts);

const balanceCTX = document.getElementById("balanceHistory");
const balanceHistory = new Chart(balanceCTX as any, {
  type: 'line',
  data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [{
          label: 'Income',
          data: [200, 50, 450, 75, 125, 150],
          backgroundColor: [
              'rgba(68, 147, 116, 0.1)',
          ],
          pointRadius: 0,
          borderColor: [
              'rgb(68, 147, 116)',
          ],
          borderWidth: 2
      },
      {
        label: 'Expense',
        data: [300,  25, 200, 0, 0, 250],
        backgroundColor: [
            'rgba(221, 20, 28, 0.1)',
        ],
        pointRadius: 0,
        borderColor: [
            'rgb(221, 20, 28)',
        ],
        borderWidth: 2
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
        bottom: 0,
        top: 0
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