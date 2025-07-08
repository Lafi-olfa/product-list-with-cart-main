document.addEventListener('DOMContentLoaded', () => {
  loadCartFromLocalStorage();
  fetch('data.json')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('products-container');
      
      data.forEach(element => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.innerHTML = `
          <div class="card-header">
            <img class="card-image" src="${element.image.desktop}" alt="${element.name}" />
            <button class="card-button">
              <img src="./assets/images/icon-add-to-cart.svg" alt="Add to cart">
              Add to cart
            </button>
          </div>
          <div class="card-body">
            <span class="category">${element.category}</span>
            <h3 class="product-name">${element.name}</h3>
            <p class="price">$${element.price.toFixed(2)}</p>
        
            </div>
        `;

        cardElement.querySelector('.card-button').addEventListener('click', () => {
          addToCart(element);
        });
        container.appendChild(cardElement);
      });
    });
});

let cart = [];

function generateProductId(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

function addToCart(product) {
  const productId = generateProductId(product.name);
  const existingProduct = cart.find(item => item.id === productId);
  
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      ...product,
      id: productId,
      quantity: 1
    });
  }

  saveCartToLocalStorage();
  updateCartUI();
  updateProductButtons(productId);
}
// update Product Buttons
function updateProductButtons(productId) {
  const productCards = document.querySelectorAll('.card');
  
  productCards.forEach(card => {
    const currentProductId = generateProductId(card.querySelector('.product-name').textContent);
    
    if (currentProductId === productId) {
      const productInCart = cart.find(item => item.id === productId);
      const cardHeader = card.querySelector('.card-header');
      
      if (productInCart) {
        cardHeader.innerHTML = `
          <img class="card-image" src="${productInCart.image.desktop}" alt="${productInCart.name}" />
          <div class="quantity-controls">
            <button class="remove-product">-</button>
            <p class="products-quantity">${productInCart.quantity}</p>
            <button class="add-product">+</button>
          </div>
        `;
        
        card.querySelector('.remove-product').addEventListener('click', (e) => {
          e.stopPropagation();
          removeFromCart(productId);
          updateCartUI()
        });
        
        card.querySelector('.add-product').addEventListener('click', (e) => {
          e.stopPropagation();
          addToCart(productInCart);
        });
      }
    }
  });
}

function saveCartToLocalStorage() {
  localStorage.setItem('orderCart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
  const savedCart = localStorage.getItem('orderCart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartUI();
    cart.forEach(item => updateProductButtons(item.id));
  }
}

function updateCartUI() {
  const emptyCartImg = document.querySelector('.empty-cart-img');
  const cartItems = document.getElementById('cart-items');
  
  if (cart.length > 0) {
    emptyCartImg.style.display = 'none';
    
    const ordersHTML = cart.map(item => `
      <div class="order">
        <div class="order-details">
          <p>${item.name}</p>
          <div class="quantity-details">
            <span class="quantity">${item.quantity}x</span>
            <span class="unit-price">@ $${item.price.toFixed(2)}</span>
            <span class="total-price">$${(item.quantity * item.price).toFixed(2)}</span>
          </div>
        </div>
        <div class="remove-order" onclick="removeFromCart('${item.id}')">
          <img src="./assets/images/icon-remove-item.svg" alt="remove-item">
        </div>
      </div>
      <hr>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartItems.innerHTML = `
      <div class="order-container">
        ${ordersHTML}
        <div class="order total">
          <p>Order Total</p>
          <p class="total-price">$${total.toFixed(2)}</p>
        </div>
        <button class="confirm-order">Confirm Order</button>
      </div>
    `;
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('#cart-container h2').textContent = `Your cart (${totalItems})`;
  } else {
    emptyCartImg.style.display = 'block';
    cartItems.innerHTML = 'Your added items will appear here';
    document.querySelector('#cart-container h2').textContent = 'Your cart (0)';
  }
}

function removeFromCart(productId) {
  const productIndex = cart.findIndex(item => item.id === productId);
  
  if (productIndex !== -1) {
    if (cart[productIndex].quantity > 1) {
      cart[productIndex].quantity -= 1;
    } else {
      cart.splice(productIndex, 1);
    }
    
    saveCartToLocalStorage();
    updateCartUI();
    updateProductButtons(productId);
  }
}