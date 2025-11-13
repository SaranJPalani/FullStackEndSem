const API_URL = 'http://localhost:5000/api';
const token = localStorage.getItem('token');

if (!token) {
    window.location.href = '/login';
}

const authBtn = document.getElementById('auth-btn');
authBtn.textContent = 'Logout';
authBtn.onclick = () => {
    localStorage.clear();
    window.location.href = '/';
};

let currentCart = null;

async function loadCart() {
    try {
        const response = await fetch(`${API_URL}/cart`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            currentCart = data.data;
            displayCart(data.data);
        }
    } catch (error) {
        document.getElementById('cart-content').innerHTML = '<p>Error loading cart</p>';
    }
}

function displayCart(cart) {
    document.getElementById('cart-content').style.display = 'none';

    if (!cart.items || cart.items.length === 0) {
        document.getElementById('cart-empty').style.display = 'block';
        return;
    }

    document.getElementById('cart-items').style.display = 'block';
    
    const itemsHtml = cart.items.map(item => {
        const product = item.productId;
        const itemTotal = item.priceAtAdd * item.quantity;
        
        return `
            <div class="cart-item">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/100x100?text=No+Image'">
                <div class="cart-item-info">
                    <h3>${product.name}</h3>
                    <p>Price: ₹${item.priceAtAdd}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="qty-btn" onclick="updateQuantity('${item._id}', ${item.quantity - 1})">-</button>
                    <input type="number" value="${item.quantity}" min="1" max="${product.stock}" 
                           onchange="updateQuantity('${item._id}', this.value)">
                    <button class="qty-btn" onclick="updateQuantity('${item._id}', ${item.quantity + 1})">+</button>
                </div>
                <div class="cart-item-total">
                    <strong>₹${itemTotal}</strong>
                    <button class="btn-remove" onclick="removeItem('${item._id}')">🗑️</button>
                </div>
            </div>
        `;
    }).join('');

    document.querySelector('.cart-items-list').innerHTML = itemsHtml;
    
    const total = cart.total || 0;
    document.getElementById('cart-subtotal').textContent = `₹${total}`;
    document.getElementById('cart-total').textContent = `₹${total}`;
}

async function updateQuantity(itemId, quantity) {
    quantity = parseInt(quantity);
    
    if (quantity < 1) {
        removeItem(itemId);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/cart/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ quantity })
        });

        const data = await response.json();

        if (data.success) {
            loadCart();
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Failed to update quantity');
    }
}

async function removeItem(itemId) {
    if (!confirm('Remove this item from cart?')) return;

    try {
        const response = await fetch(`${API_URL}/cart/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            loadCart();
        }
    } catch (error) {
        alert('Failed to remove item');
    }
}

document.getElementById('checkout-btn')?.addEventListener('click', () => {
    if (currentCart && currentCart.items && currentCart.items.length > 0) {
        window.location.href = '/checkout';
    }
});

loadCart();
