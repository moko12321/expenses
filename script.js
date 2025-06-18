let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

document.getElementById("expense-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("expense-name").value;
  const amount = parseFloat(document.getElementById("expense-amount").value);
  const date = document.getElementById("expense-date").value;
  const note = document.getElementById("expense-note").value;

  if (!name || !amount || !date) return;

  expenses.push({ name, amount, date, note });
  saveExpenses();
  renderExpenses();
  this.reset();
});

function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function renderExpenses() {
  const list = document.getElementById("expense-list");
  list.innerHTML = "";

  const filterNote = document.getElementById("filter-note").value.toLowerCase();
  const filterDate = document.getElementById("filter-date").value;

  let total = 0;

  expenses.forEach((exp, index) => {
    if (
      (filterNote && !exp.note.toLowerCase().includes(filterNote)) ||
      (filterDate && exp.date !== filterDate)
    ) {
      return;
    }

    total += exp.amount;

    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <span><strong>${exp.name}</strong> - ${exp.amount}₺</span>
        <span>${exp.date} | ${exp.note}</span>
      </div>
      <div class="actions">
        <button onclick="editExpense(${index})" title="تعديل">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#2196f3" viewBox="0 0 24 24">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 000-1.42l-2.34-2.34a1.003 1.003 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/>
          </svg>
        </button>
        <button onclick="deleteExpense(${index})" title="حذف">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#f44336" viewBox="0 0 24 24">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 
            1H5v2h14V4z"/>
          </svg>
        </button>
      </div>
    `;
    list.appendChild(li);
  });

  document.getElementById("total-amount").textContent = total.toFixed(2) + '₺';
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  saveExpenses();
  renderExpenses();
}

function editExpense(index) {
  const exp = expenses[index];
  document.getElementById("expense-name").value = exp.name;
  document.getElementById("expense-amount").value = exp.amount;
  document.getElementById("expense-date").value = exp.date;
  document.getElementById("expense-note").value = exp.note;

  expenses.splice(index, 1);
  saveExpenses();
  renderExpenses();
}

document.getElementById("filter-note").addEventListener("input", renderExpenses);
document.getElementById("filter-date").addEventListener("input", renderExpenses);

document.getElementById("export-btn").addEventListener("click", () => {
  const exportData = expenses.map(exp => ({
    "الاسم": exp.name,
    "المبلغ": exp.amount,
    "التاريخ": exp.date,
    "الملاحظات": exp.note
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "المصروفات");

  const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "المصروفات.xlsx";
  a.click();
  URL.revokeObjectURL(url);
});

renderExpenses();
