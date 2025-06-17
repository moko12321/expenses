let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let editIndex = -1;

document.getElementById("expense-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("expense-name").value;
  const amount = parseFloat(document.getElementById("expense-amount").value);
  const date = document.getElementById("expense-date").value;
  const note = document.getElementById("expense-note").value;

  if (editIndex === -1) {
    expenses.push({ name, amount, date, note });
  } else {
    expenses[editIndex] = { name, amount, date, note };
    editIndex = -1;
    document.getElementById("submit-btn").textContent = "➕ أضف مصروف";
  }

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
        <span><strong>${exp.name}</strong> - ${exp.amount.toFixed(2)} ₺</span>
        <span>${exp.date} | ${exp.note}</span>
      </div>
      <div class="action-buttons">
        <button class="edit-btn" onclick="editExpense(${index})">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/></svg>
          تعديل
        </button>
        <button class="delete-btn" onclick="deleteExpense(${index})">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-4.5l-1-1z"/></svg>
          حذف
        </button>
      </div>
    `;
    list.appendChild(li);
  });

  document.getElementById("total-amount").textContent = `${total.toFixed(2)} ₺`;
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

  document.getElementById("submit-btn").textContent = "💾 حفظ التعديل";
  editIndex = index;
}

document.getElementById("filter-note").addEventListener("input", renderExpenses);
document.getElementById("filter-date").addEventListener("input", renderExpenses);

document.getElementById("export-btn").addEventListener("click", () => {
  const exportData = expenses.map(exp => ({
    "الاسم": exp.name,
    "المبلغ (₺)": exp.amount.toFixed(2),
    "التاريخ": exp.date,
    "الملاحظات": exp.note
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "المصروفات");

  XLSX.writeFile(workbook, "المصروفات_الليرة_التركية.xlsx");
});

renderExpenses();
