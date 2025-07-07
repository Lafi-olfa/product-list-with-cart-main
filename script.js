fetch('data.json')
  .then(res => res.json())
  .then(data => {
    console.log(data);
    
    const container = document.getElementById('products-container');
        // <button class="card-button">
            //   <img src="./assets/images/icon-add-to-cart.svg" alt="Add to cart">
            //   Add to cart
            // </button>  
    if(data) {
      data.forEach(element => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.innerHTML = `
          <div class="card-header">
            <img class="card-image" src="${element.image.desktop}" alt="${element.name}" />
        
            <div class="card-button">
       
            <button class="remove-product">-</button>
            <p class="products-quantity">1 </p>
            <button class="add-product">+</button>
            </div> 
            </div>
          <div class="card-body">
            <span class="category">${element.category}</span>
            <h3 class="product-name">${element.name}</h3>
            <p class="price">$${element.price.toFixed(2)}</p>
          
          </div>
        `;
        container.appendChild(cardElement);
        
        cardElement.querySelector('.card-button').addEventListener('click', () => {
          addToCart(element);
        });
      });
    }
  });

function addToCart(product) {
  console.log('Added to cart:', product);
}