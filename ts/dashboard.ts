import {HTTP} from "./http";
import {TransactionOverlay} from "./transaction";
import {AccountOverlay} from "./account"

//import * as Chart from "chart.js";
declare var Chart;
declare var luxon;
const DateTime = luxon.DateTime;

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
    return accounts;
  }).then((accounts) => { 
    HTTP.get(`/accounts/${accounts[0]["id"]}`).then((data) => {
      const accountBalance = JSON.parse(data as string);
      const avalBalance = document.getElementById("currentBalance");
      avalBalance.textContent = accountBalance["balance"]["available"];
      console.log(accountBalance["balance"]["available"])
    });
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
      category.textContent = transaction["category_name"];

      dropdown.className = "material-icons";
      dropdown.textContent = "more_horiz";
      options.className = "center_text";
      options.colSpan = 2;
      options.appendChild(dropdown);

      fields.push(date);
      fields.push(amount);
      fields.push(desc);
      fields.push(account_name);
      fields.push(category);
      fields.push(options);

      for (let field of fields as any) {
        row.appendChild(field);
      }

      tranTable.appendChild(row);
    }
  });
});

Chart.defaults.global.defaultFontFamily = "'Lato', sans-serif";
Chart.defaults.global.defaultFontSize = 14;

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

const colors = [
  "#BEC0C1",
  "#980B12",
  "#DD141C",
  "#55211C",
  "#A3A442",
  "#DD4F4B",
];

pieOpts.data.datasets[0].backgroundColor = colors;

const doughnut = new Chart(categoryCTX as any, pieOpts);

const balHistoryOpts = {
  type: 'line',
  data: {
      labels: [],
      datasets: [{
          label: 'Income',
          data: [],
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
        data: [],
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
}

const balanceOverviewOpts = {
  type: 'bar',
  labels: [],
  datasets: [{
    label: "Balance by Month",
    data: [],
    backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(255, 206, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(153, 102, 255, 0.2)',
    ],
    borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
    ],
    borderWidth: 1
  }]
}

HTTP.get("/transactions?monthly=true").then((data) => { 
  const monTransactions = JSON.parse(data as string);
  for (let month of monTransactions["monthly_total_types"]) {
    const formatMon = DateTime.fromString(month["month"], "yyyy-LL").toFormat("LLL");
    balHistoryOpts.data.labels.push(formatMon);
    balHistoryOpts.data.datasets[0].data.push(month["income"]);
    balHistoryOpts.data.datasets[1].data.push(month["expense"]);
  }
  const balanceCTX = document.getElementById("balanceHistory");
  const balanceHistory = new Chart(balanceCTX as any, balHistoryOpts);
});