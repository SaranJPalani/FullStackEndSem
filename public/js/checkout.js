const API_URL = 'http://localhost:5000/api';
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');

if (!token) {
    window.location.href = '/login';
}

let cart = null;

async function loadCart() {
    try {
        const response = await fetch(`${API_URL}/cart`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            cart = data.data;
            displayOrderSummary(data.data);
            prefillShippingInfo();
        }
    } catch (error) {
        console.error('Failed to load cart');
    }
}

function displayOrderSummary(cart) {
    if (!cart.items || cart.items.length === 0) {
        window.location.href = '/cart';
        return;
    }

    const itemsHtml = cart.items.map(item => {
        const product = item.productId;
        return `
            <div class="order-summary-item">
                <span>${product.name} x ${item.quantity}</span>
                <span>₹${item.priceAtAdd * item.quantity}</span>
            </div>
        `;
    }).join('');

    document.getElementById('order-items').innerHTML = itemsHtml;
    
    const total = cart.total || 0;
    document.getElementById('order-subtotal').textContent = `₹${total}`;
    document.getElementById('order-total').textContent = `₹${total}`;
}

function prefillShippingInfo() {
    if (user.name) document.getElementById('name').value = user.name;
    if (user.phone) document.getElementById('phone').value = user.phone;
    if (user.address) {
        document.getElementById('street').value = user.address.street || '';
        document.getElementById('city').value = user.address.city || '';
        document.getElementById('state').value = user.address.state || '';
        document.getElementById('pincode').value = user.address.pincode || '';
    }
}

document.getElementById('checkout-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const shippingAddress = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        street: document.getElementById('street').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        pincode: document.getElementById('pincode').value
    };

    const errorEl = document.getElementById('checkout-error');

    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ shippingAddress })
        });

        const data = await response.json();

        if (data.success) {
            // Show success modal
            document.getElementById('order-id').textContent = data.data.orderId;
            document.getElementById('success-modal').style.display = 'flex';
        } else {
            errorEl.textContent = data.message;
        }
    } catch (error) {
        errorEl.textContent = 'Failed to place order. Please try again.';
    }
});

document.getElementById('view-orders').addEventListener('click', () => {
    window.location.href = '/orders';
});

document.getElementById('continue-shopping').addEventListener('click', () => {
    window.location.href = '/';
});

loadCart();
