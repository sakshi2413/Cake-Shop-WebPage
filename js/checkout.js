// Checkout page functionality

const DELIVERY_CHARGE = 50;

// Display order items
function displayOrderItems() {
    const orderItemsContainer = document.getElementById('order-items');
    const subtotalElement = document.querySelector('.subtotal');
    const finalTotalElement = document.querySelector('.final-total');

    if (!orderItemsContainer) return;

    const cartItems = cart.items;

    if (cartItems.length === 0) {
        orderItemsContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #666;">
                <p style="font-size: 1.6rem;">Your cart is empty</p>
                <a href="cakes.html" style="display: inline-block; margin-top: 1rem; color: var(--primary-color); text-decoration: none;">Continue Shopping</a>
            </div>
        `;
        const submitBtn = document.querySelector('.submit-order-btn');
        if (submitBtn) submitBtn.disabled = true;
        return;
    }

    orderItemsContainer.innerHTML = cartItems.map(item => `
        <div class="order-item">
            <div class="order-item-info">
                <h4>${item.name}</h4>
                <p>Quantity: ${item.quantity} × ₹${item.price.toFixed(2)}</p>
            </div>
            <div class="order-item-price">₹${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');

    const subtotal = cart.getTotal();
    const total = subtotal + DELIVERY_CHARGE;

    if (subtotalElement) subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
    if (finalTotalElement) finalTotalElement.textContent = `₹${total.toFixed(2)}`;
}

// Handle form submission
const checkoutForm = document.getElementById('checkout-form');
if (checkoutForm) {
    checkoutForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const cartItems = cart.items;
        
        if (cartItems.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        const submitBtn = document.querySelector('.submit-order-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;

        const formData = new FormData(checkoutForm);
        const orderData = {
            customer_name: formData.get('customer_name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            delivery_address: formData.get('delivery_address'),
            notes: formData.get('notes'),
            total_amount: cart.getTotal() + DELIVERY_CHARGE,
            items: cartItems
        };

        // Simulate order processing
        setTimeout(() => {
            alert('Order placed successfully!\n\nOrder Details:\nName: ' + orderData.customer_name + '\nTotal: ₹' + orderData.total_amount.toFixed(2) + '\n\nThank you for shopping with Cake Xpress!');
            cart.clearCart();
            window.location.href = '../index.html';
        }, 1000);
    });
}

// Initialize checkout page
if (window.location.pathname.includes('checkout.html')) {
    displayOrderItems();
    cart.updateCartUI();
}
