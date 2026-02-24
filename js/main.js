// Main JavaScript for UI interactions

// Toggle search form
const searchIcon = document.querySelector('.search-icon');
if (searchIcon) {
    searchIcon.addEventListener('click', () => {
        document.querySelector('.search-form').classList.toggle('active');
        const cartContainer = document.querySelector('.cart-items-container');
        if (cartContainer) cartContainer.classList.remove('active');
        const navbar = document.querySelector('.navbar');
        if (navbar) navbar.classList.remove('active');
    });
}

// Toggle cart
const cartIcon = document.querySelector('.cart-icon');
if (cartIcon) {
    cartIcon.addEventListener('click', () => {
        document.querySelector('.cart-items-container').classList.toggle('active');
        const searchForm = document.querySelector('.search-form');
        if (searchForm) searchForm.classList.remove('active');
        const navbar = document.querySelector('.navbar');
        if (navbar) navbar.classList.remove('active');
    });
}

// Toggle mobile menu
const menuIcon = document.querySelector('.menu-icon');
if (menuIcon) {
    menuIcon.addEventListener('click', () => {
        document.querySelector('.navbar').classList.toggle('active');
        const searchForm = document.querySelector('.search-form');
        if (searchForm) searchForm.classList.remove('active');
        const cartContainer = document.querySelector('.cart-items-container');
        if (cartContainer) cartContainer.classList.remove('active');
    });
}

// Close all menus on scroll
window.addEventListener('scroll', () => {
    const searchForm = document.querySelector('.search-form');
    if (searchForm) searchForm.classList.remove('active');
    const cartContainer = document.querySelector('.cart-items-container');
    if (cartContainer) cartContainer.classList.remove('active');
    const navbar = document.querySelector('.navbar');
    if (navbar) navbar.classList.remove('active');
});

// Search functionality
const searchBox = document.getElementById('search-box');
if (searchBox) {
    searchBox.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const productCards = document.querySelectorAll('.cake-card');

        productCards.forEach(card => {
            const productName = card.dataset.productName.toLowerCase();
            if (productName.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}
