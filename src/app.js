// Начальный список товаров
let products = [
  { id: 1, name: "Алма (Апорт)", price: 850, quantity: 2 },
  { id: 2, name: "Сүт (1л)", price: 480, quantity: 3 },
  { id: 3, name: "Нан (Ақ)", price: 220, quantity: 1 }
];

// Получение элементов DOM
const productForm = document.getElementById('product-form');
const nameInput = document.getElementById('product-name');
const priceInput = document.getElementById('product-price');
const quantityInput = document.getElementById('product-quantity');

const nameError = document.getElementById('name-error');
const priceError = document.getElementById('price-error');
const quantityError = document.getElementById('quantity-error');

const productList = document.getElementById('product-list');
const emptyState = document.getElementById('empty-state');
const totalCountElement = document.getElementById('total-count');
const totalPriceElement = document.getElementById('total-price');

// Отображение продуктов на странице
function renderProducts() {
  if (!productList) return;
  
  productList.innerHTML = '';

  if (products.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
  } else {
    if (emptyState) emptyState.style.display = 'none';

    products.forEach((product) => {
      const row = document.createElement('tr');

      row.innerHTML = `
        <td><strong>${product.name}</strong></td>
        <td>${product.price.toLocaleString()} ₸</td>
        <td>
          <input 
            type="number" 
            class="qty-input-table" 
            value="${product.quantity}" 
            min="1" 
            onchange="updateQuantity(${product.id}, this.value)"
          >
        </td>
        <td><strong>${(product.price * product.quantity).toLocaleString()} ₸</strong></td>
        <td class="text-right">
          <button class="btn-delete" onclick="deleteProduct(${product.id})">Өшіру</button>
        </td>
      `;

      productList.appendChild(row);
    });
  }

  updateTotal();
}

// Подсчет итоговой суммы и количества
function updateTotal() {
  const totalItems = products.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = products.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (totalCountElement) totalCountElement.textContent = totalItems;
  if (totalPriceElement) totalPriceElement.textContent = `${totalPrice.toLocaleString()} ₸`;
}

// Валидация формы
function validateForm() {
  let isValid = true;

  if (nameInput && !nameInput.value.trim()) {
    if (nameError) nameError.textContent = 'Тауар атауын енгізіңіз!';
    isValid = false;
  } else if (nameError) {
    nameError.textContent = '';
  }

  if (priceInput && (!priceInput.value || Number(priceInput.value) <= 0)) {
    if (priceError) priceError.textContent = 'Бағасы 0-ден үлкен болуы керек!';
    isValid = false;
  } else if (priceError) {
    priceError.textContent = '';
  }

  if (quantityInput && (!quantityInput.value || Number(quantityInput.value) <= 0)) {
    if (quantityError) quantityError.textContent = 'Саны кемінде 1 болуы керек!';
    isValid = false;
  } else if (quantityError) {
    quantityError.textContent = '';
  }

  return isValid;
}

// Добавление нового товара
if (productForm) {
  productForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const newProduct = {
      id: Date.now(),
      name: nameInput.value.trim(),
      price: Number(priceInput.value),
      quantity: Number(quantityInput.value)
    };

    products.push(newProduct);
    renderProducts();

    productForm.reset();
  });
}

// Изменение количества товара
window.updateQuantity = function(id, newQty) {
  const qty = Number(newQty);
  if (qty <= 0) return;

  const product = products.find(p => p.id === id);
  if (product) {
    product.quantity = qty;
    renderProducts();
  }
};

// Удаление товара
window.deleteProduct = function(id) {
  products = products.filter(p => p.id !== id);
  renderProducts();
};

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', renderProducts);
