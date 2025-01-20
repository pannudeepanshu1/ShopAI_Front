const products = [
  { id: 1, name: 'Apple', price: 3.00, image: 'images/apple.jpg', type: 'Fruit', variety: 'Red' },
  { id: 2, name: 'Banana', price: 2.00, image: 'images/banana.png', type: 'Fruit', variety: 'Yellow' },
  { id: 3, name: 'Carrot', price: 1.50, image: 'images/carrot.png', type: 'Vegetable', variety: 'Orange' },
  { id: 4, name: 'Broccoli', price: 2.50, image: 'images/broccoli.jpg', type: 'Vegetable', variety: 'Green' },
  { id: 5, name: 'Mango', price: 4.00, image: 'images/mango.jpg', type: 'Fruit', variety: 'Yellow' },
  { id: 6, name: 'Cucumber', price: 1.20, image: 'images/cucumber.jpg', type: 'Vegetable', variety: 'Green' },
  { id: 7, name: 'Lettuce', price: 1.80, image: 'images/lettuce.png', type: 'Vegetable', variety: 'Green' },
  { id: 8, name: 'Orange', price: 2.50, image: 'images/orange.jpg', type: 'Fruit', variety: 'Orange' }
];

const cart = {};
const addSynonyms = ['add', 'put', 'place', 'insert', 'include', 'throw in'];
const removeSynonyms = ['remove', 'take out', 'delete', 'subtract', 'take away', 'minus'];

function renderProducts(filteredProducts) {
  const productsContainer = document.getElementById('products');
  productsContainer.innerHTML = '';

  filteredProducts.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.setAttribute('data-id', product.id);
      productCard.innerHTML = 
          `<img src="${product.image}" alt="${product.name}">
           <h3>${product.name}</h3>
           <p>$${product.price.toFixed(2)}</p>
           <div class="counter">
             <button class="minus">-</button>
             <span class="quantity">0</span>
             <button class="plus">+</button>
           </div>`;

      productsContainer.appendChild(productCard);

      const plusButton = productCard.querySelector('.plus');
      const minusButton = productCard.querySelector('.minus');
      const quantityDisplay = productCard.querySelector('.quantity');

      plusButton.addEventListener('click', () => {
          handleQuantityChange(product.id, 1);
          quantityDisplay.textContent = cart[product.id] || 0;
      });

      minusButton.addEventListener('click', () => {
          handleQuantityChange(product.id, -1);
          quantityDisplay.textContent = cart[product.id] || 0;
      });
  });
}

function updateCart() {
  const cartItemsContainer = document.getElementById('cart-items');
  cartItemsContainer.innerHTML = '';
  let totalPrice = 0;

  Object.keys(cart).forEach(productId => {
      const product = products.find(p => p.id == productId);
      const quantity = cart[productId];
      totalPrice += product.price * quantity;

      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = 
          `<p>${product.name} x${quantity} - $${(product.price * quantity).toFixed(2)}</p>`;
      cartItemsContainer.appendChild(cartItem);
  });

  document.getElementById('total-price').textContent = totalPrice.toFixed(2);
}

function handleQuantityChange(productId, increment) {
  if (!cart[productId]) cart[productId] = 0;
  cart[productId] += increment;

  if (cart[productId] <= 0) {
      delete cart[productId]; // Remove item from cart if quantity is 0
  }

  updateCart();
  updateSuggestionText();
}

function updateSuggestionText() {
  const cartItems = Object.keys(cart);
  if (cartItems.length === 0) {
      document.getElementById('suggestion-text').textContent = '';
      return;
  }

  const productInCart = products.find(p => p.id == cartItems[0]);
  let suggestionText = "";

  if (productInCart) {
      switch (productInCart.name) {
          case "Apple":
              suggestionText = "An apple a day keeps the doctor away, add some peanut butter for extra yum!";
              break;
          case "Banana":
              suggestionText = "With banana, you might like milk. Time for a banana shake, right? Yummy!";
              break;
          case "Carrot":
              suggestionText = "Carrots are great for a healthy crunch! Add them to a salad for extra crunchiness!";
              break;
          case "Broccoli":
              suggestionText = "Broccoli pairs wonderfully with garlic and olive oil. Add it to your stir-fry!";
              break;
          case "Mango":
              suggestionText = "Mangoes go well with yogurt! How about making a mango smoothie?";
              break;
          case "Cucumber":
              suggestionText = "Cool and refreshing! Cucumber makes a great addition to salads or sandwiches.";
              break;
          case "Lettuce":
              suggestionText = "Lettuce is perfect for light salads. Why not top it off with some tomatoes and feta cheese?";
              break;
          case "Orange":
              suggestionText = "Oranges are a great source of vitamin C. Perfect for a healthy juice or snack!";
              break;
          default:
              suggestionText = "How about adding something else to your cart?";
      }
  }

  document.getElementById('suggestion-text').textContent = suggestionText;
}


document.getElementById('start-voice').addEventListener('click', function() {
  startVoiceRecognition();
});

function startVoiceRecognition() {
  const recognition = new(window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.start();

  recognition.onresult = function(event) {
      const transcript = event.results[0][0].transcript.toLowerCase();
      const chatbox = document.getElementById('chatbox');
      const chatMessage = document.createElement('div');
      chatMessage.className = 'chat-message';
      chatMessage.textContent = `You said: "${transcript}"`;
      chatbox.appendChild(chatMessage);

      processVoiceCommand(transcript);
  };

  recognition.onerror = function(event) {
      const chatbox = document.getElementById('chatbox');
      const errorMessage = document.createElement('div');
      errorMessage.className = 'chat-message';
      errorMessage.textContent = `Error: ${event.error}`;
      chatbox.appendChild(errorMessage);
  };
}

function processVoiceCommand(command) {
  const commandParts = command.split('and');
  commandParts.forEach(part => {
      let quantity = 1;
      let product = null;
      let isAddCommand = false;
      let isRemoveCommand = false;

      if (addSynonyms.some(synonym => part.includes(synonym))) {
          isAddCommand = true;
      } else if (removeSynonyms.some(synonym => part.includes(synonym))) {
          isRemoveCommand = true;
      }

      products.forEach(p => {
          if (part.includes(p.name.toLowerCase())) {
              product = p;
          }
      });

      const quantityMatch = part.match(/(\d+|one|two|three|four|five|six|seven|eight|nine|ten)/);
      if (quantityMatch) {
          const quantityText = quantityMatch[0];
          if (isNaN(quantityText)) {
              const numberWords = {
                  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10
              };
              quantity = numberWords[quantityText] || 1;
          } else {
              quantity = parseInt(quantityText, 10);
          }
      }

      if (product) {
          if (isAddCommand) {
              handleQuantityChange(product.id, quantity);
              updateChatbox(`${quantity} ${product.name}(s) added to the cart.`);
          } else if (isRemoveCommand) {
              handleQuantityChange(product.id, -quantity);
              updateChatbox(`${quantity} ${product.name}(s) removed from the cart.`);
          }
      } else {
          updateChatbox("Sorry, I couldn't find that product.");
      }
  });
}

function updateChatbox(message) {
  const chatbox = document.getElementById('chatbox');
  const chatMessage = document.createElement('div');
  chatMessage.className = 'chat-message';
  chatMessage.textContent = message;
  chatbox.appendChild(chatMessage);
}

document.getElementById('place-order').addEventListener('click', () => {
  if (Object.keys(cart).length === 0) {
      alert('Your cart is empty!');
  } else {
      alert('Order placed successfully!');
      Object.keys(cart).forEach(productId => delete cart[productId]);
      updateCart();
      updateSuggestionText();
  }
});

// Update category filter logic
document.getElementById('category-filter').addEventListener('change', function() {
  const categoryFilter = this.value.toLowerCase();
  const filteredProducts = products.filter(product => {
      if (categoryFilter === "all" || categoryFilter === "") {
          return true; // Show all products if "all" or empty filter
      }
      return product.type.toLowerCase() === categoryFilter;
  });

  renderProducts(filteredProducts);
});

document.getElementById('search-box').addEventListener('input', function() {
  const searchQuery = this.value.toLowerCase();
  const categoryFilter = document.getElementById('category-filter').value;

  const filteredProducts = products.filter(product => {
      const matchesCategory = categoryFilter ? product.type.toLowerCase() === categoryFilter.toLowerCase() : true;
      return product.name.toLowerCase().includes(searchQuery) && matchesCategory;
  });

  renderProducts(filteredProducts);
});

// Initially render all products
renderProducts(products);
