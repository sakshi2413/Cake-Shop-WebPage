// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

const API = {
    PRODUCTS: `${API_BASE_URL}/products`,
    PRODUCTS_BY_CATEGORY: (category) => `${API_BASE_URL}/products/category/${category}`,
    ORDERS: `${API_BASE_URL}/orders`,
    HEALTH: `${API_BASE_URL}/health`
};

// Helper function to fetch data from API
async function fetchAPI(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Check if backend is available
async function checkBackendConnection() {
    try {
        const response = await fetchAPI(API.HEALTH);
        console.log('✅ Backend connected:', response);
        return true;
    } catch (error) {
        console.warn('⚠️ Backend not available, using static data');
        return false;
    }
}

// Make functions globally available
window.API = API;
window.fetchAPI = fetchAPI;
window.checkBackendConnection = checkBackendConnection;
