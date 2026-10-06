import { Store } from './Store.js';

const store = new Store();

// DOM Elements
const form = document.getElementById('product-form');
const productList = document.getElementById('product-list');
const totalPriceEl = document.getElementById('total-price');
const emptyState = document.getElementById('empty-state');
const itemCountBadge = document.getElementById('item-count');

const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');
const qtyInput = document.getElementById('qty');

const nameError = document.getElementById('name-error');
const priceError = document.getElementById('price-error');
const qtyError = document.getElementById('qty-error');

// Form Validation
function validateForm(name, price, qty) {
  let isValid = true;

  nameError.textContent = '';
  priceError.textContent = '';
  qtyError.textContent = '';

  if (!name.trim()) {
    nameError.textContent = 'Please enter a product name.';
    isValid = false;
  }

  if (isNaN(price) || price <= 0) {
    priceError.textContent = 'Price must be greater than 0.';
    isValid = false;
  }

  if (isNaN(qty) || qty <= 0 || !Number.isInteger(qty)) {
    qtyError.textContent = 'Quantity must be a positive integer.';
    isValid = false;
  }

  return isValid;
}

// Render Products & Total
function render() {
  productList.innerHTML = '';

  if (store.items.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
  }

  store.items.forEach((item, index) => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td style="font-weight: 500;">${item.name}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td>
        <input type="number" class="qty-input-table" data-index="${index}" value="${item.qty}" min="1">
      </td>
      <td style="font-weight: 600;">$${(item.price * item.qty).toFixed(2)}</td>
      <td class="text-right">
        <button class="btn btn-delete" data-index="${index}">Delete</button>
      </td>
    `;

    productList.appendChild(tr);
  });

  itemCountBadge.textContent = `${store.items.length} ${store.items.length === 1 ? 'item' : 'items'}`;
  totalPriceEl.textContent = store.getTotal().toFixed(2);
}

// Event 1: Form Submit
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = nameInput.value;
  const price = parseFloat(priceInput.value);
  const qty = parseInt(qtyInput.value, 10);

  if (validateForm(name, price, qty)) {
    store.add({ name, price, qty });
    form.reset();
    render();
  }
});

// Event Delegation: Delete & Change Quantity
productList.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-delete')) {
    const index = e.target.dataset.index;
    store.remove(index);
    render();
  }
});

productList.addEventListener('input', (e) => {
  if (e.target.classList.contains('qty-input-table')) {
    const index = e.target.dataset.index;
    const newQty = parseInt(e.target.value, 10);

    if (!isNaN(newQty) && newQty > 0) {
      store.updateQty(index, newQty);
      render();
    }
  }
});

// Initial Render
render();
