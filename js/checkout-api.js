// checkout-api.js - API-enabled checkout with backend submission

const DELIVERY_CHARGE = 50;

// Check if backend is available
async function checkBackendConnection() {
    try {
        const response = await fetch(API.HEALTH);
        const data = await response.json();
        return data.status === 'OK';
    } catch (error) {
        console.warn('⚠️ Backend not available:', error);
        return false;
    }
}

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

// Submit order to API
async function submitOrderToAPI(orderData) {
    try {
        const response = await window.fetchAPI(window.API.ORDERS, {
            method: 'POST',
            body: JSON.stringify(orderData)
        });

        if (response.success) {
            return {
                success: true,
                orderId: response.data.orderId
            };
        } else {
            throw new Error(response.message || 'Failed to place order');
        }
    } catch (error) {
        throw error;
    }
}

// Handle form submission with API
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
            delivery_address: formData.get('delivery_address'),
            total_amount: cart.getTotal() + DELIVERY_CHARGE,
            items: cartItems.map(item => ({
                product_id: item.id,
                product_name: item.name,
                quantity: item.quantity,
                price: item.price
            }))
        };

        try {
            // Check if backend is available
            let backendAvailable = false;
            
            // Safely check backend connection
            if (typeof window.checkBackendConnection === 'function') {
                try {
                    backendAvailable = await window.checkBackendConnection();
                } catch (e) {
                    console.warn('Backend check failed:', e);
                    backendAvailable = false;
                }
            }

            if (backendAvailable) {
                // Submit to API
                console.log('📤 Submitting order to API...');
                const result = await submitOrderToAPI(orderData);
                
                alert(
                    '✅ Order placed successfully!\n\n' +
                    'Order ID: ' + result.orderId + '\n' +
                    'Customer: ' + orderData.customer_name + '\n' +
                    'Total: ₹' + orderData.total_amount.toFixed(2) + '\n\n' +
                    'Your order has been saved to the database.\n' +
                    'Thank you for shopping with Cake Xpress!'
                );
                
                cart.clearCart();
                window.location.href = '../index.html';
            } else {
                // Fallback: Local processing (no API)
                console.log('⚠️ Backend not available, processing locally');
                alert(
                    '✅ Order processed locally!\n\n' +
                    'Customer: ' + orderData.customer_name + '\n' +
                    'Total: ₹' + orderData.total_amount.toFixed(2) + '\n\n' +
                    'Note: Backend is not connected.\n' +
                    'Order was not saved to database.\n\n' +
                    'Thank you for shopping with Cake Xpress!'
                );
                
                cart.clearCart();
                window.location.href = '../index.html';
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert(
                '❌ Error placing order\n\n' +
                error.message + '\n\n' +
                'Please make sure:\n' +
                '1. Backend server is running (npm start)\n' +
                '2. MySQL database is configured\n' +
                '3. Check browser console for details'
            );
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Initialize checkout page
if (window.location.pathname.includes('checkout.html')) {
    displayOrderItems();
    cart.updateCartUI();
}
