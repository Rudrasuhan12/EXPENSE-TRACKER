document.addEventListener("DOMContentLoaded", () => {
    loadMonths();
    updateYearlyExpenses();
    updatePaymentHistory();
});

// Load months into dropdown
function loadMonths() {
    const monthFilter = document.getElementById("monthFilter");
    monthFilter.innerHTML = "";
    
    for (let i = 0; i < 12; i++) {
        let monthOption = new Date(2025, i).toLocaleString("default", { month: "long" });
        let option = document.createElement("option");
        option.value = i;
        option.textContent = monthOption;
        monthFilter.appendChild(option);
    }
    
    updateMonthlyExpenses();
}

// Add a new expense
function addExpense() {
    let desc = document.getElementById("desc").value;
    let recipient = document.getElementById("recipient").value;
    let amount = parseFloat(document.getElementById("amount").value);
    let month = new Date(document.getElementById("month").value).getMonth();

    if (!desc || !recipient || isNaN(amount) || month < 0) {
        alert("Please enter valid details!");
        return;
    }

    let expenses = JSON.parse(localStorage.getItem("expenses")) || {};
    let history = JSON.parse(localStorage.getItem("history")) || [];

    if (!expenses[month]) expenses[month] = [];
    
    let expenseEntry = { desc, recipient, amount };
    expenses[month].push(expenseEntry);
    history.push({ desc, recipient, amount, date: new Date().toLocaleDateString() });

    localStorage.setItem("expenses", JSON.stringify(expenses));
    localStorage.setItem("history", JSON.stringify(history));

    document.getElementById("desc").value = "";
    document.getElementById("recipient").value = "";
    document.getElementById("amount").value = "";

    updateMonthlyExpenses();
    updateYearlyExpenses();
    updatePaymentHistory();
}

// Update monthly expenses
function updateMonthlyExpenses() {
    let selectedMonth = document.getElementById("monthFilter").value;
    let expenses = JSON.parse(localStorage.getItem("expenses")) || {};
    
    let expenseList = document.getElementById("expenseList");
    expenseList.innerHTML = "";

    let totalMonthly = 0;

    if (expenses[selectedMonth]) {
        expenses[selectedMonth].forEach((expense, index) => {
            let li = document.createElement("li");
            li.classList.add("list-group-item");
            li.innerHTML = `${expense.desc} (Paid to: ${expense.recipient}) - <strong>$${expense.amount.toFixed(2)}</strong>
                <button class="btn btn-danger btn-sm" onclick="deleteExpense(${selectedMonth}, ${index})">X</button>`;
            
            expenseList.appendChild(li);
            totalMonthly += expense.amount;
        });
    }

    document.getElementById("monthlyTotal").textContent = `$${totalMonthly.toFixed(2)}`;
}

// Delete an expense
function deleteExpense(month, index) {
    let expenses = JSON.parse(localStorage.getItem("expenses")) || {};
    let history = JSON.parse(localStorage.getItem("history")) || [];

    history = history.filter((_, i) => i !== index);
    localStorage.setItem("history", JSON.stringify(history));

    expenses[month].splice(index, 1);
    if (expenses[month].length === 0) delete expenses[month];

    localStorage.setItem("expenses", JSON.stringify(expenses));
    updateMonthlyExpenses();
    updateYearlyExpenses();
    updatePaymentHistory();
}

// Update yearly expenses
function updateYearlyExpenses() {
    let expenses = JSON.parse(localStorage.getItem("expenses")) || {};
    let totalYearly = 0;

    Object.values(expenses).forEach(monthExpenses => {
        monthExpenses.forEach(expense => totalYearly += expense.amount);
    });

    document.getElementById("yearlyTotal").textContent = `$${totalYearly.toFixed(2)}`;
}

// Update payment history
function updatePaymentHistory() {
    let history = JSON.parse(localStorage.getItem("history")) || [];
    let paymentHistory = document.getElementById("paymentHistory");

    paymentHistory.innerHTML = "";
    
    history.forEach(payment => {
        let li = document.createElement("li");
        li.classList.add("list-group-item");
        li.innerHTML = `${payment.date} - ${payment.desc} (Paid to: ${payment.recipient}) - <strong>$${payment.amount.toFixed(2)}</strong>`;
        paymentHistory.appendChild(li);
    });
}
