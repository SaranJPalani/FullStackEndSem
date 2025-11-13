const API_URL = 'http://localhost:5000/api';

// Check authentication
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');
const authBtn = document.getElementById('auth-btn');
const ordersLink = document.getElementById('orders-link');
const profileLink = document.getElementById('profile-link');
const adminLink = document.getElementById('admin-link');

if (token) {
    authBtn.textContent = 'Logout';
    authBtn.onclick = () => {
        localStorage.clear();
        window.location.reload();
    };
    
    if (ordersLink) ordersLink.style.display = 'inline';
    if (profileLink) profileLink.style.display = 'inline';
    if (adminLink && user.role === 'admin') adminLink.style.display = 'inline';
} else {
    authBtn.onclick = () => window.location.href = '/login';
}

// Load products
let allProducts = [];

async function loadProducts(category = '', search = '') {
    try {
        let url = `${API_URL}/products?`;
        if (category) url += `category=${category}&`;
        if (search) url += `search=${search}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
            allProducts = data.data;
            displayProducts(data.data);
        }
    } catch (error) {
        document.getElementById('products-grid').innerHTML = '<p>Error loading products</p>';
    }
}

function displayProducts(products) {
    const grid = document.getElementById('products-grid');
    
    if (products.length === 0) {
        grid.innerHTML = '<p>No products found</p>';
        return;
    }

    const html = products.map(product => {
        const isFlashSale = product.flashSale?.isActive && new Date(product.flashSale.endTime) > new Date();
        const currentPrice = isFlashSale ? product.flashSale.salePrice : product.price;
        
        // Calculate countdown for flash sale
        let countdownHtml = '';
        if (isFlashSale) {
            const endTime = new Date(product.flashSale.endTime);
            const now = new Date();
            const timeLeft = endTime - now;
            
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            countdownHtml = `<div class="flash-timer" data-end-time="${product.flashSale.endTime}">Ends in ${hours}h ${minutes}m ${seconds}s</div>`;
        }
        
        return `
            <div class="product-card" data-product-id="${product._id}">
                ${isFlashSale ? '<div class="flash-badge">FLASH SALE</div>' : ''}
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x300?text=No+Image'">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-category">${product.category}</p>
                    <p class="product-description">${product.description.substring(0, 100)}...</p>
                    ${countdownHtml}
                    <div class="product-price">
                        ${isFlashSale ? `<span class="original-price">₹${product.price}</span>` : ''}
                        <span class="current-price">₹${currentPrice}</span>
                    </div>
                    <div class="product-stock">
                        ${product.stock > 0 ? `✅ ${product.stock} in stock` : '❌ Out of stock'}
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-secondary" onclick="viewProduct('${product._id}')">View Details</button>
                        ${product.stock > 0 ? `
                            <button class="btn btn-primary" onclick="quickAddToCart('${product._id}')">Add to Cart</button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    grid.innerHTML = html;
    
    // Start countdown timers for flash sale products
    startCountdownTimers();
}

function viewProduct(id) {
    window.location.href = `/product/${id}`;
}

async function quickAddToCart(productId) {
    if (!token) {
        window.location.href = '/login';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productId, quantity: 1 })
        });

        const data = await response.json();

        if (data.success) {
            alert('Product added to cart!');
            updateCartCount();
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Failed to add to cart');
    }
}

async function updateCartCount() {
    if (!token) return;

    try {
        const response = await fetch(`${API_URL}/cart`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            const count = data.data.items?.length || 0;
            const badge = document.getElementById('cart-count');
            if (badge) {
                badge.textContent = count;
                badge.style.display = count > 0 ? 'inline' : 'none';
            }
        }
    } catch (error) {
        console.error('Failed to update cart count');
    }
}

// Search and filter
document.getElementById('search-btn')?.addEventListener('click', () => {
    const search = document.getElementById('search-input').value;
    const category = document.getElementById('category-filter').value;
    loadProducts(category, search);
});

document.getElementById('category-filter')?.addEventListener('change', (e) => {
    const search = document.getElementById('search-input').value;
    loadProducts(e.target.value, search);
});

// Initialize
loadProducts();
updateCartCount();

// Countdown timer for flash sales
let countdownInterval = null;

function startCountdownTimers() {
    if (countdownInterval) clearInterval(countdownInterval);
    
    countdownInterval = setInterval(() => {
        const timers = document.querySelectorAll('.flash-timer');
        let allExpired = true;
        
        timers.forEach(timer => {
            const endTime = new Date(timer.dataset.endTime);
            const now = new Date();
            const timeLeft = endTime - now;
            
            if (timeLeft > 0) {
                allExpired = false;
                
                const hours = Math.floor(timeLeft / (1000 * 60 * 60));
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                
                timer.textContent = `Ends in ${hours}h ${minutes}m ${seconds}s`;
                
                // Add urgency styling when less than 1 hour left
                if (timeLeft < 3600000) { // Less than 1 hour
                    timer.classList.add('urgent');
                }
            } else {
                timer.textContent = 'Sale Ended';
                timer.classList.add('expired');
            }
        });
        
        // Reload products if all sales expired
        if (allExpired && timers.length > 0) {
            clearInterval(countdownInterval);
            setTimeout(() => {
                loadProducts();
            }, 2000);
        }
    }, 1000); // Update every second
}
