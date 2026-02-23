// Cart Management
class Cart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartUI();
    }

    // Load cart from localStorage
    loadCart() {
        const savedCart = localStorage.getItem('cakeXpressCart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('cakeXpressCart', JSON.stringify(this.items));
    }

    // Add item to cart
    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: parseFloat(product.price),
                image: product.image,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartUI();
        this.showNotification('Item added to cart!');
    }

    // Remove item from cart
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
    }

    // Update item quantity
    updateQuantity(productId, change) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.saveCart();
                this.updateCartUI();
            }
        }
    }

    // Get cart total
    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Get total items count
    getItemsCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    // Clear cart
    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartUI();
    }

    // Update cart UI
    updateCartUI() {
        // Update cart count
        const cartCountElements = document.querySelectorAll('.cart-count');
        const itemsCount = this.getItemsCount();
        cartCountElements.forEach(element => {
            element.textContent = itemsCount;
            element.style.display = itemsCount > 0 ? 'block' : 'none';
        });

        // Update cart items display
        const cartItemsContainer = document.querySelector('.cart-items');
        const emptyCart = document.querySelector('.empty-cart');
        const cartFooter = document.querySelector('.cart-footer');

        if (!cartItemsContainer) return;

        if (this.items.length === 0) {
            if (emptyCart) emptyCart.style.display = 'block';
            cartItemsContainer.innerHTML = '';
            if (cartFooter) cartFooter.style.display = 'none';
        } else {
            if (emptyCart) emptyCart.style.display = 'none';
            if (cartFooter) cartFooter.style.display = 'block';

            cartItemsContainer.innerHTML = this.items.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="content">
                        <h3>${item.name}</h3>
                        <div class="price">₹${item.price.toFixed(2)}</div>
                        <div class="quantity">
                            <button onclick="cart.updateQuantity(${item.id}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="cart.updateQuantity(${item.id}, 1)">+</button>
                        </div>
                    </div>
                    <i class="fa-solid fa-times remove-btn" onclick="cart.removeItem(${item.id})"></i>
                </div>
            `).join('');

            // Update total price
            const totalPrice = document.querySelector('.total-price');
            if (totalPrice) {
                totalPrice.textContent = `₹${this.getTotal().toFixed(2)}`;
            }
        }
    }

    // Show notification
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 10rem;
            right: 2rem;
            background: #4caf50;
            color: white;
            padding: 1.5rem 2rem;
            border-radius: 0.5rem;
            font-size: 1.6rem;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}

// Initialize cart
const cart = new Cart();

// Add to cart functionality
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
        e.preventDefault();
        
        const card = e.target.closest('.cake-card');
        if (!card) return;

        const product = {
            id: parseInt(card.dataset.productId) || Date.now(),
            name: card.dataset.productName,
            price: parseFloat(card.dataset.productPrice),
            image: card.dataset.productImage
        };

        cart.addItem(product);
    }
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
