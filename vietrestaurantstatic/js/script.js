document.addEventListener('DOMContentLoaded', () => {
    let navbar = document.querySelector('.navbar');
    let searchForm = document.querySelector('.search-form');
    let cartItemsContainer = document.querySelector('.cart-items-container');
    let searchBtn = document.querySelector('#search-btn');
    let cartBtn = document.querySelector('#cart-btn');
    let menuBtn = document.querySelector('#menu-btn'); 

    if (navbar && searchForm && cartItemsContainer && searchBtn && cartBtn && menuBtn) {
        searchBtn.onclick = () => {
            searchForm.classList.toggle('active');
            navbar.classList.remove('active');
            cartItemsContainer.classList.remove('active');
        }

        cartBtn.onclick = () => {
            cartItemsContainer.classList.toggle('active');
            navbar.classList.remove('active');
            searchForm.classList.remove('active');
        }

        menuBtn.onclick = () => {
            navbar.classList.toggle('active');
            searchForm.classList.remove('active');
            cartItemsContainer.classList.remove('active');
        }

        window.onscroll = () => {
            navbar.classList.remove('active');
            searchForm.classList.remove('active');
            cartItemsContainer.classList.remove('active');
        }
    }

    function showGif(event, gifId) {
        event.preventDefault();
        const overlay = document.getElementById(gifId);
        overlay.style.display = 'flex';
        const script = document.createElement('script');
        script.src = 'https://tenor.com/embed.js';
        script.async = true;
        overlay.appendChild(script);
    }

    function hideGif(event) {
        if (event.target.classList.contains('overlay')) {
            event.target.style.display = 'none';
        }
    }

    function showAlert(event, message) {
        event.preventDefault();
        alert(message);
    }

    function validateForm(event) {
        event.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const number = document.getElementById('number').value.trim();

        if (name && email && number) {
            alert('Sent!');
        } else {
            alert('Please fill the form');
        }
    }

    function addToCart(event, itemName, itemPrice) {
        event.preventDefault();
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalItems = document.getElementById('total-items');
        const cartTotalPrice = document.getElementById('total-price');

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-items');
        cartItem.innerHTML = `
            <span class="fas fa-times" onclick="removeFromCart(event, ${itemPrice})"></span>
            <div class="content">
                <h3>${itemName}</h3>
                <div class="price">$${itemPrice}/-</div>
                <input type="number" value="1" min="1" class="quantity" onchange="updateCartItem(event, ${itemPrice})">
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);

        updateCartTotal(itemPrice, 1);
    }

    function removeFromCart(event, itemPrice) {
        event.preventDefault();
        const cartItem = event.target.closest('.cart-items');
        const quantity = parseInt(cartItem.querySelector('.quantity').value);
        cartItem.remove();
        updateCartTotal(-itemPrice * quantity, -quantity);
    }

    function updateCartItem(event, itemPrice) {
        const quantityInput = event.target;
        const cartItem = quantityInput.closest('.cart-items');
        const oldQuantity = parseInt(quantityInput.getAttribute('data-old-value') || 1);
        const newQuantity = parseInt(quantityInput.value);
        const quantityChange = newQuantity - oldQuantity;

        updateCartTotal(itemPrice * quantityChange, quantityChange);
        quantityInput.setAttribute('data-old-value', newQuantity);
    }

    function updateCartTotal(priceChange, itemCountChange) {
        const cartTotalItems = document.getElementById('total-items');
        const cartTotalPrice = document.getElementById('total-price');

        cartTotalItems.textContent = parseInt(cartTotalItems.textContent) + itemCountChange;
        cartTotalPrice.textContent = (parseFloat(cartTotalPrice.textContent) + priceChange).toFixed(2);
    }

    function checkout() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartItems = cartItemsContainer.querySelectorAll('.cart-items');
        const items = [];

        cartItems.forEach(item => {
            const itemName = item.querySelector('h3').textContent;
            const itemPrice = parseFloat(item.querySelector('.price').textContent.replace('$', ''));
            const quantity = parseInt(item.querySelector('.quantity').value);
            items.push({ name: itemName, price: itemPrice, quantity });
        });

        fetch('checkout.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ items })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Checkout successful!');
                cartItemsContainer.innerHTML = '';
                updateCartTotal(-parseFloat(document.getElementById('total-price').textContent), -parseInt(document.getElementById('total-items').textContent));
            } else {
                alert('Checkout failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Checkout failed. Please try again.');
        });
    }

    window.showGif = showGif;
    window.hideGif = hideGif;
    window.showAlert = showAlert;
    window.validateForm = validateForm;
    window.addToCart = addToCart;
    window.removeFromCart = removeFromCart;
    window.updateCartItem = updateCartItem;
    window.checkout = checkout;
});