// write javascript here

'use strict';

// Selecting all the elements
const expenseForm = document.getElementById('expense-form');
const expenseBtn = document.getElementById('expense-btn');
const expenseTableBody = document.getElementById('expense-TableBody');
const expenseCategory = document.getElementById('expense-category');
const expenseDate = document.getElementById('expense-date')
// console.log(expenseTableBody);
const totalExpenseDisplay = document.getElementById('total-expense');
// console.log(totalExpenseDisplay);


const filterByCategory = document.getElementById('filter-category');
console.log(filterByCategory);


// to store data in local storage.
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// console.log(formExpense, expenseName, expenseAmount, expenseDate, expenseCategory, expenseBtn);

// to add categories in table.
const addCategoriesToForm = function (select, placeholder) {
  const categories = [`${placeholder}`, 'Housing', 'Transportation', 'Food', 'Medical', 'Other'];
  // console.log(categories);
  categories.forEach(cate => {
    const option = document.createElement('option');
    option.textContent = cate;
    option.value = (cate === placeholder) ? '' : cate;
    select.appendChild(option);
  })
};

addCategoriesToForm(expenseCategory, 'Category');

addCategoriesToForm(filterByCategory, 'All');

// Setting max date 
const today = new Date();
// console.log(today);
const formattedDate = today.toISOString().split('T')[0];

console.log(formattedDate);
expenseDate.setAttribute('max', formattedDate);


const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) => Math.floor(Math.abs((date2 - date1)) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(today, date);
  // console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

const addExpense = function (expense) {
  expenses.push(expense);
  console.log(expense);

  localStorage.setItem('expenses', JSON.stringify(expenses));
  renderExpenses();
  calculateTotal();
};


// Function to show expenses in the table
const renderExpenses = function (filterCategory = '') {
  expenseTableBody.innerHTML = '';

  const filteredExpenses = filterCategory
    ? expenses.filter(expense => expense.category === filterCategory)
    : expenses;

  filteredExpenses.forEach((expense, index) => {
    const row = document.createElement('tr');
    row.classList.add('expense-fields', 'margin-btm');

    const movementDate = new Date(expense.date);
    const showDate = formatMovementDate(movementDate);

    row.innerHTML = `
      <td class="expense-data">${expense.name}</td>
      <td class="expense-data">$${expense.amount.toFixed(2)}</td>
      <td class="expense-data">${showDate}</td>
      <td class="expense-data">${expense.category}</td>
      <td class="expense-data"><button data-index="${index}" class="delete-btn">Delete</button></td>
    `;

    expenseTableBody.appendChild(row);
  });
};
renderExpenses();


// to calculate total expenses

const calculateTotal = function () {
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  totalExpenseDisplay.textContent = `$${total.toFixed(2)}`;
};
calculateTotal();


// adding event listener to expense form
expenseForm.addEventListener('submit', (e) => {

  e.preventDefault();

  const name = document.getElementById('expense-name').value;
  const amount = + document.getElementById('expense-amount').value;
  const date = document.getElementById('expense-date').value;
  const category = document.getElementById('expense-category').value;

  console.log(amount, name, date, category);

  if (name && amount && date) {
    addExpense({ name, amount, date, category });
    expenseForm.reset();
  };
});


//delete data from table.
expenseTableBody.addEventListener('click', function (e) {
  if (e.target.classList.contains('delete-btn')) {
    const index = e.target.getAttribute('data-index');
    console.log(index);
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    renderExpenses();
    calculateTotal();
  }
});


// FIlterby category 
filterByCategory.addEventListener('change', function () {
  const selectedCategory = filterByCategory.value;
  // console.log(selectedCategory);
  renderExpenses(selectedCategory);
});