// ========================================
// URBANMART - COMPLETE JAVASCRIPT
// ========================================

// Product Database
const products = [
    { id: 1, name: "Premium Cotton T-Shirt", price: 39.99, category: "featured", icon: "fa-tshirt", description: "Soft, breathable cotton fabric" },
    { id: 2, name: "Classic Denim Jacket", price: 89.99, category: "featured", icon: "fa-shopping-bag", description: "Timeless denim style" },
    { id: 3, name: "Urban Sneakers", price: 69.99, category: "featured", icon: "fa-shoe-prints", description: "Comfortable everyday sneakers" },
    { id: 4, name: "Wireless Headphones", price: 99.99, category: "all", icon: "fa-headphones", description: "Noise cancellation technology" },
    { id: 5, name: "Smart Watch", price: 149.99, category: "all", icon: "fa-clock", description: "Track your fitness goals" },
    { id: 6, name: "Leather Backpack", price: 79.99, category: "all", icon: "fa-bag-shopping", description: "Durable and stylish" }
];

// Cart Management
let cart = JSON.parse(localStorage.getItem('urbanmart_cart')) || [];

function saveCart() {
    localStorage.setItem('urbanmart_cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badges = document.querySelectorAll('.cart-count');
    badges.forEach(badge => {
        if (badge) badge.textContent = total;
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart();
    showNotification(`${product.name} added to cart!`, 'success');
    
    // Update cart page if open
    if (typeof renderCart === 'function') renderCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    showNotification('Item removed from cart', 'info');
    if (typeof renderCart === 'function') renderCart();
}

function updateQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, quantity);
        saveCart();
        if (typeof renderCart === 'function') renderCart();
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 12px 20px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Load Products
function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    
    const featured = products.filter(p => p.category === 'featured');
    container.innerHTML = featured.map(product => `
        <div class="product-card">
            <div class="product-image">
                <i class="fas ${product.icon}"></i>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p style="color: #666; font-size: 0.85rem; margin-bottom: 0.5rem;">${product.description}</p>
                <div class="product-price">$${product.price}</div>
                <button class="btn btn-outline" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

function loadAllProducts() {
    const container = document.getElementById('allProducts');
    if (!container) return;
    
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <i class="fas ${product.icon}"></i>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p style="color: #666; font-size: 0.85rem; margin-bottom: 0.5rem;">${product.description}</p>
                <div class="product-price">$${product.price}</div>
                <button class="btn btn-outline" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

function renderCart() {
    const container = document.getElementById('cartItems');
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added any items yet.</p>
                <a href="products.html" class="btn btn-primary">Start Shopping</a>
            </div>
        `;
        return;
    }
    
    let total = 0;
    let html = `
        <table class="cart-table">
            <thead>
                <tr><th>Product</th><th>Price</th><th>Quantity</th><th>Total</th><th></th></tr>
            </thead>
            <tbody>
    `;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        html += `
            <tr>
                <td><strong>${item.name}</strong><br><small style="color:#666">${item.description}</small></td>
                <td>$${item.price}</td>
                <td>
                    <input type="number" class="cart-quantity" value="${item.quantity}" min="1" 
                           onchange="updateQuantity(${item.id}, this.value)">
                </td>
                <td>$${itemTotal.toFixed(2)}</td>
                <td><button class="remove-btn" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i> Remove</button></td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
        <div class="cart-summary">
            <h3>Total: $${total.toFixed(2)}</h3>
            <button class="btn btn-primary" onclick="checkout()">
                <i class="fas fa-credit-card"></i> Proceed to Checkout
            </button>
        </div>
    `;
    
    container.innerHTML = html;
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'info');
        return;
    }
    alert(`Thank you for your order!\n\nTotal: $${cart.reduce((sum, i) => sum + (i.price * i.quantity), 0).toFixed(2)}\n\nYour order has been placed successfully!`);
    cart = [];
    saveCart();
    renderCart();
}

// Authentication
function checkLoginStatus() {
    fetch('check_auth.php')
        .then(res => res.json())
        .then(data => {
            const authLinks = document.getElementById('authLinks');
            const userInfo = document.getElementById('userInfo');
            const userName = document.getElementById('userName');
            
            if (data.logged_in && authLinks && userInfo) {
                authLinks.style.display = 'none';
                userInfo.style.display = 'flex';
                if (userName) userName.textContent = data.user_name;
            }
        })
        .catch(() => {});
}

function logout() {
    window.location.href = 'logout.php';
}

// Mobile Menu Toggle
function initMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const nav = document.getElementById('navLinks');
    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('show');
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    checkLoginStatus();
    initMobileMenu();
    
    if (document.getElementById('featuredProducts')) loadFeaturedProducts();
    if (document.getElementById('allProducts')) loadAllProducts();
    if (document.getElementById('cartItems')) renderCart();
    
    // Contact form handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const response = await fetch('save_contact.php', { method: 'POST', body: formData });
            const result = await response.json();
            const msg = document.getElementById('formMessage');
            msg.style.display = 'block';
            msg.className = result.success ? 'success' : 'error';
            msg.innerHTML = result.message;
            if (result.success) contactForm.reset();
            setTimeout(() => msg.style.display = 'none', 3000);
        });
    }
    
    // Login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            const response = await fetch('login.php', { method: 'POST', body: formData });
            const result = await response.json();
            const msg = document.getElementById('loginMessage');
            msg.style.display = 'block';
            msg.className = result.success ? 'success' : 'error';
            msg.innerHTML = result.message;
            if (result.success) setTimeout(() => window.location.href = 'index.html', 1500);
        });
    }
    
    // Register form handler
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(registerForm);
            const response = await fetch('register.php', { method: 'POST', body: formData });
            const result = await response.json();
            const msg = document.getElementById('registerMessage');
            msg.style.display = 'block';
            msg.className = result.success ? 'success' : 'error';
            msg.innerHTML = result.message;
            if (result.success) setTimeout(() => window.location.href = 'login.html', 2000);
        });
    }
});