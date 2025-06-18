// تحميل المصروفات من التخزين المحلي أو البدء بمصفوفة فارغة
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
        <span><strong>${exp.name}</strong> - ${exp.amount}$</span>
        <span>${exp.date} | ${exp.note}</span>
      </div>
      <button onclick="deleteExpense(${index})">🗑️</button>
    `;
    list.appendChild(li);
  });

  document.getElementById("total-amount").textContent = total.toFixed(2);
}

function deleteExpense(index) {
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

  // إنشاء ملف بصيغة Blob لضمان التوافق مع الهواتف
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

// عرض المصروفات عند تحميل الصفحة
renderExpenses();
