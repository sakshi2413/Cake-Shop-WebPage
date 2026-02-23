// products-api.js - Load products from API (backend database)

// Load products for specific page
async function loadProductsFromAPI() {
    // Determine which page we're on
    const currentPage = window.location.pathname;
    let category = '';
    let containerId = '';

    if (currentPage.includes('cakes.html')) {
        category = 'cake';
        containerId = 'cakes-container';
    } else if (currentPage.includes('pastries.html')) {
        category = 'pastry';
        containerId = 'pastries-container';
    } else if (currentPage.includes('new-arrivals.html')) {
        category = 'new-arrival';
        containerId = 'new-arrivals-container';
    }

    if (!category) return; // Not on a product page

    const container = document.querySelector('.wrapper');
    if (!container) return;

    try {
        // Show loading message
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <i class="fa-solid fa-spinner fa-spin" style="font-size: 3rem; color: var(--primary-color);"></i>
                <p style="font-size: 1.8rem; margin-top: 1rem;">Loading products...</p>
            </div>
        `;

        // Fetch products from API
        const response = await window.fetchAPI(window.API.PRODUCTS_BY_CATEGORY(category));

        if (response.success && response.data && response.data.length > 0) {
            // Clear loading message
            container.innerHTML = '';

            // Render products
            response.data.forEach(product => {
                const productCard = createProductCard(product);
                container.innerHTML += productCard;
            });
        } else {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #666;">
                    <i class="fa-solid fa-box-open" style="font-size: 4rem; color: var(--primary-color); margin-bottom: 1rem;"></i>
                    <p style="font-size: 1.8rem;">No products found in this category.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading products:', error);
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #666;">
                <i class="fa-solid fa-exclamation-triangle" style="font-size: 4rem; color: #f44336; margin-bottom: 1rem;"></i>
                <p style="font-size: 1.8rem;">Unable to load products.</p>
                <p style="font-size: 1.4rem; margin-top: 1rem;">Make sure the backend server is running on port 3000.</p>
                <button onclick="loadProductsFromAPI()" class="btn" style="margin-top: 2rem;">Try Again</button>
            </div>
        `;
    }
}

// Create product card HTML
function createProductCard(product) {
    return `
        <div class="cake-card" 
             data-product-id="${product.id}"
             data-product-name="${product.name}" 
             data-product-price="${product.price}" 
             data-product-image="${product.image}">
            <div class="img-wrapper">
                <img src="${product.image}" alt="${product.name}" 
                     onerror="this.src='images/placeholder.jpg'">
            </div>
            <h3>${product.name}</h3>
            <div class="price">₹${product.price}</div>
            <a href="#" class="btn add-to-cart">Add to Cart</a>
        </div>
    `;
}

// Load featured products on home page
async function loadFeaturedProductsFromAPI() {
    const featuredContainer = document.querySelector('#featured .wrapper');
    if (!featuredContainer) return;

    try {
        featuredContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <i class="fa-solid fa-spinner fa-spin" style="font-size: 3rem; color: var(--primary-color);"></i>
                <p style="font-size: 1.8rem; margin-top: 1rem;">Loading featured products...</p>
            </div>
        `;

        const response = await window.fetchAPI(window.API.PRODUCTS_BY_CATEGORY('cake'));

        if (response.success && response.data && response.data.length > 0) {
            // Get first 3 products as featured
            const featuredProducts = response.data.slice(0, 3);
            
            featuredContainer.innerHTML = '';
            featuredProducts.forEach(product => {
                const productCard = createProductCard(product);
                featuredContainer.innerHTML += productCard;
            });
        }
    } catch (error) {
        console.error('Error loading featured products:', error);
        featuredContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #666;">
                <p style="font-size: 1.8rem;">Unable to load featured products.</p>
                <p style="font-size: 1.4rem; margin-top: 1rem;">Using static display.</p>
            </div>
        `;
    }
}

// Initialize products loading when page loads
document.addEventListener('DOMContentLoaded', async function() {
    // Check if backend is available
    let backendAvailable = false;
    
    // Safely check backend connection
    if (typeof window.checkBackendConnection === 'function') {
        try {
            backendAvailable = await window.checkBackendConnection();
        } catch (e) {
            console.warn('Backend check failed, will use static HTML:', e);
            backendAvailable = false;
        }
    } else {
        console.log('Config.js not loaded, using static HTML products');
    }

    if (backendAvailable) {
        console.log('📦 Loading products from API...');
        
        // Load products based on current page
        if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
            await loadFeaturedProductsFromAPI();
        } else if (window.location.pathname.includes('.html')) {
            await loadProductsFromAPI();
        }
    } else {
        console.log('📦 Backend not available, using static HTML products');
    }
});
