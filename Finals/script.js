document.addEventListener('DOMContentLoaded', function() {
    const productCards = document.querySelectorAll('.product-card');
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartCount = document.querySelector('.cart-count');
    const cartItemsList = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    // Function to add item to cart
    function addToCart(product) {
        cartItems.push(product);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartCount();
        displayCartItems();
        showNotification('Item added to cart.');
    }

    // Function to update cart count
    function updateCartCount() {
        cartCount.textContent = cartItems.length;
    }

    // Function to display cart items
    function displayCartItems() {
        if (cartItems.length === 0) {
            cartItemsList.innerHTML = '<li>Your cart is empty.</li>';
        } else {
            cartItemsList.innerHTML = '';
            cartItems.forEach((item, index) => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" width="50">
                    <p>${item.name} - ${item.price} <button class="delete-item" data-index="${index}">Remove</button></p>
                `;
                cartItemsList.appendChild(listItem);
            });

            // Calculate and display the total price
            displayCartTotal();
        }
    }

    // Function to calculate and display the total price
    function displayCartTotal() {
        const total = cartItems.reduce((sum, item) => {
            // Remove the non-numeric characters and parse the price
            const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
            return sum + price;
        }, 0);

        // Display the total price with the peso sign
        cartTotalElement.textContent = `Total: ₱${total.toFixed(2)}`;
    }

    // Function to remove item from cart
    function removeFromCart(index) {
        cartItems.splice(index, 1);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartCount();
        displayCartItems();
        showNotification('Item removed from cart.');
    }

    // Function to show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }

    // Attach event listeners to "Buy Now" buttons
    productCards.forEach(card => {
        const button = card.querySelector('.btn');
        button.addEventListener('click', () => {
            const productName = card.querySelector('h3').textContent;
            const productPrice = card.querySelector('.price').textContent;
            const productImage = card.querySelector('img').src;

            const product = {
                name: productName,
                price: productPrice,
                image: productImage
            };

            addToCart(product);
        });
    });

    // Attach event listeners to "Remove" buttons in cart
    cartItemsList.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-item')) {
            const index = event.target.dataset.index;
            removeFromCart(index);
        }
    });

    // Initial display of cart items, count, and total
    displayCartItems();
    updateCartCount();
    displayCartTotal();
});
