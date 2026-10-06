import { Store } from './Store.js';

const store = new Store();

const form = document.getElementById('product-form');
const productList = document.getElementById('product-list');
const totalPriceEl = document.getElementById('total-price');

const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');
const qtyInput = document.getElementById('qty');

const nameError = document.getElementById('name-error');
const priceError = document.getElementById('price-error');
const qtyError = document.getElementById('qty-error');

function validateForm(name, price, qty) {
  let isValid = true;

  nameError.textContent = '';
  priceError.textContent = '';
  qtyError.textContent = '';

  if (!name.trim()) {
    nameError.textContent = 'Тауар атауын енгізіңіз!';
    isValid = false;
  }

  if (isNaN(price) || price <= 0) {
    priceError.textContent = 'Баға 0-ден үлкен сан болуы керек!';
    isValid = false;
  }

  if (isNaN(qty) || qty <= 0 || !Number.isInteger(qty)) {
    qtyError.textContent = 'Саны оң бүтін сан болуы керек!';
    isValid = false;
  }

  return isValid;
}

function render() {
  productList.innerHTML = '';

  store.items.forEach((item, index) => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.price} ₸</td>
      <td>
        <input type="number" class="qty-input" data-index="${index}" value="${item.qty}" min="1">
      </td>
      <td>${item.price * item.qty} ₸</td>
      <td>
        <button class="btn-delete" data-index="${index}">Өшіру</button>
      </td>
    `;

    productList.appendChild(tr);
  });

  totalPriceEl.textContent = store.getTotal();
}

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

productList.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-delete')) {
    const index = e.target.dataset.index;
    store.remove(index);
    render();
  }
});

productList.addEventListener('input', (e) => {
  if (e.target.classList.contains('qty-input')) {
    const index = e.target.dataset.index;
    const newQty = parseInt(e.target.value, 10);

    if (!isNaN(newQty) && newQty > 0) {
      store.updateQty(index, newQty);
      render();
    }
  }
});
