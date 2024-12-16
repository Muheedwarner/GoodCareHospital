// Wait for the entire DOM to load before executing the script
document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalPrice = document.querySelector('.cart-total-price');
    const confirmPurchaseButton = document.querySelector('#confirm-purchase');
    const goBackButton = document.querySelector('#go-back');
    const checkoutForm = document.querySelector('#checkout-form');

    // Load cart for checkout from localStorage
    const checkoutData = JSON.parse(localStorage.getItem('checkoutCart'));
    if (checkoutData) {
        checkoutData.cart.forEach(item => {
            const cartRow = document.createElement('div');
            cartRow.classList.add('cart-row');
            cartRow.innerHTML = `
                <div class="cart-item cart-column">
                    <span class="cart-item-title">${item.title}</span>
                </div>
                <span class="cart-price cart-column">${item.price}</span>
                <span class="cart-quantity cart-column">QTY. ${item.quantity}</span>
            `;
            cartItemsContainer.appendChild(cartRow);
        });

        // Display total price
        cartTotalPrice.textContent = `$${checkoutData.total.toFixed(2)}`;
    } else {
        // If no checkout data, show a message
        cartItemsContainer.innerHTML = '<p>No items found in your cart.</p>';
    }

    // Confirm purchase functionality
    confirmPurchaseButton.addEventListener('click', () => {
        const formElements = checkoutForm.elements;
        let isFormValid = true;

        // Validate form fields
        for (const element of formElements) {
            if (element.type !== 'button' && element.value.trim() === '') {
                alert(`Please fill in the ${element.previousElementSibling.textContent}`);
                isFormValid = false;
                break;
            }
        }

        if (isFormValid) {
            const deliveryDate = document.querySelector('#delivery-date').value;
            alert(`Thank you for your purchase! 
                
Delivery Date: ${deliveryDate}

You will be redirected to the Home Page shortly.`);
            localStorage.removeItem('checkoutCart');
            window.location.href = 'index.html';
        }
    });

    // Go back to shopping cart
    goBackButton.addEventListener('click', () => {
        window.location.href = 'Pharmacy.html'; // Redirect back to the cart page
    });
});