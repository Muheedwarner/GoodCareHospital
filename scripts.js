// Wait for the entire DOM to load before executing the script
document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.shop-item-button');
    const cartItemsContainer = document.querySelector('.cart-items');
    const purchaseButton = document.querySelector('.btn-purchase');
    const clearCartButton = document.querySelector('#clear-cart');
    const saveFavoritesButton = document.querySelector('#save-favorites');
    const loadFavoritesButton = document.querySelector('#load-favorites');
    const cartTotalPrice = document.querySelector('.cart-total-price');

    // Load cart from localStorage on page load
    loadCartFromStorage();

    // Event listeners for buttons
    addToCartButtons.forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });

    purchaseButton.addEventListener('click', () => {
        if (cartItemsContainer.children.length === 0) {
            alert('Your cart is empty.');
        } else {
            // Saving the cart data to localStorage for the checkout page
            saveCartForCheckout();
            // Redirect to the checkout page
            window.location.href = 'checkout.html';
        }
    });
    // Clear cart button
    clearCartButton.addEventListener('click', () => {
        clearCart();
    });
    // Save cart favorites button
    saveFavoritesButton.addEventListener('click', () => {
        if (cartItemsContainer.children.length === 0) {
            alert('Your cart is empty. Add items before saving as favorites.');
        } else {
            saveFavorites();
        }
    });
    // Load cart favorites button
    loadFavoritesButton.addEventListener('click', () => {
        if (confirm('Do you want to load your favorite items into the cart?')) {
            loadFavorites();
        }
    });

    // Function to handle adding items to the cart
    function handleAddToCart(event) {
        const shopItem = event.target.closest('.shop-item');
        const title = shopItem.querySelector('.shop-item-title').textContent;
        const price = shopItem.querySelector('.shop-item-price').textContent;
        const imageSrc = shopItem.querySelector('.shop-item-image').src;

        addItemToCart(title, price, imageSrc);
        updateCartTotal();
        saveCartToStorage();
    }

    // Function to create and add a new cart item
    function addItemToCart(title, price, imageSrc) {
        const cartItems = cartItemsContainer.querySelectorAll('.cart-item-title');
        
        // To not add the duplicate items
        for (const item of cartItems) {
            if (item.textContent === title) {
                return;
            }
        }
        // Create a new div element to represent a row in the shopping cart
        const cartRow = document.createElement('div');
        // Add a class to the new cart row for styling and identification
        cartRow.classList.add('cart-row');
        // Define the inner HTML of the cart row including the item's image, title, price, and quantity controls
        cartRow.innerHTML = `
            <div class="cart-item cart-column">
                <img class="cart-item-image" src="${imageSrc}" width="50" height="50" alt="${title}">
                <span class="cart-item-title">${title}</span>
            </div>
            <span class="cart-price cart-column">${price}</span>
            <div class="cart-quantity cart-column">
                <input class="cart-quantity-input" type="number" value="1" min="1">
                <button class="btn btn-danger" type="button">REMOVE</button>
            </div>
        `;
        // Append the new cart row to the container that holds all cart items
        cartItemsContainer.appendChild(cartRow);
        // Add an event listener to the "REMOVE" button for removing the item from the cart
        cartRow.querySelector('.btn-danger').addEventListener('click', () => {
            cartRow.remove();
            updateCartTotal();
            saveCartToStorage();
        });
        // Add an event listener to the quantity input field to handle changes in quantity
        cartRow.querySelector('.cart-quantity-input').addEventListener('change', (event) => {
            const input = event.target; // Get the input field that triggered the event
            // Ensure the input value is a positive number; if not, set it to 1
            if (isNaN(input.value) || input.value <= 0) {
                input.value = 1;
            }
            updateCartTotal();
            saveCartToStorage();
        });
    }

    // Func for update cart total
    function updateCartTotal() {
        let total = 0;
        const cartRows = cartItemsContainer.querySelectorAll('.cart-row');
        cartRows.forEach(row => {
            const priceElement = row.querySelector('.cart-price');
            const quantityElement = row.querySelector('.cart-quantity-input');
            const price = parseFloat(priceElement.textContent.replace('$', ''));
            const quantity = parseInt(quantityElement.value);
            total += price * quantity;
        });

        cartTotalPrice.textContent = `$${total.toFixed(2)}`;
    }

    // Func to clear cart items
    function clearCart() {
        while (cartItemsContainer.firstChild) {
            cartItemsContainer.removeChild(cartItemsContainer.firstChild);
        }
        updateCartTotal();
        saveCartToStorage();
    }

    // Saving the cart to localStorage
    function saveCartToStorage() {
        const cartRows = cartItemsContainer.querySelectorAll('.cart-row');
        const cart = [];
        cartRows.forEach(row => {
            const title = row.querySelector('.cart-item-title').textContent;
            const price = row.querySelector('.cart-price').textContent;
            const imageSrc = row.querySelector('.cart-item-image').src;
            const quantity = row.querySelector('.cart-quantity-input').value;

            cart.push({ title, price, imageSrc, quantity });
        });
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Loading cart from localStorage
    function loadCartFromStorage() {
        const storedCart = JSON.parse(localStorage.getItem('cart'));
        if (storedCart) {
            storedCart.forEach(item => {
                addItemToCart(item.title, item.price, item.imageSrc);
                const cartRow = cartItemsContainer.querySelector('.cart-row:last-child .cart-quantity-input');
                cartRow.value = item.quantity;
            });
            updateCartTotal();
        }
    }

    // Save cart data for checkout
    function saveCartForCheckout() {
        const cartRows = cartItemsContainer.querySelectorAll('.cart-row');
        const cart = [];
        cartRows.forEach(row => {
            const title = row.querySelector('.cart-item-title').textContent;
            const price = row.querySelector('.cart-price').textContent;
            const quantity = row.querySelector('.cart-quantity-input').value;

            cart.push({ title, price, quantity });
        });
        
        const total = cart.reduce((sum, item) => {
            const price = parseFloat(item.price.replace('$', ''));
            const quantity = parseInt(item.quantity);
            return sum + price * quantity;
        }, 0);

        // Store cart details and total in localStorage for checkout
        localStorage.setItem('checkoutCart', JSON.stringify({ cart, total }));
    }

    // Save favorites to localStorage
    function saveFavorites() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        localStorage.setItem('favorites', JSON.stringify(cart));
        alert('Favorites saved successfully!');
    }

    // Load favorites from localStorage and apply to cart
    function loadFavorites() {
        const favorites = JSON.parse(localStorage.getItem('favorites'));
        if (!favorites || favorites.length === 0) {
            alert('No favorite items found.');
            return;
        }

        clearCart(); // Clearing the current cart before applying favorites
        favorites.forEach(item => {
            addItemToCart(item.title, item.price, item.imageSrc);
            const cartRow = cartItemsContainer.querySelector('.cart-row:last-child .cart-quantity-input');
            cartRow.value = item.quantity;
        });

        updateCartTotal();
    }
});
