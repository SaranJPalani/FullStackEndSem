const API_URL = 'http://localhost:5000/api';

let flashSaleProducts = [];
let flashSaleInterval = null;

async function loadFlashSales() {
    try {
        const response = await fetch(`${API_URL}/products/flash-sales`);
        const data = await response.json();

        if (data.success && data.data.length > 0) {
            flashSaleProducts = data.data;
            showFlashSaleBanner();
            startFlashSaleTimer();
        }
    } catch (error) {
        console.error('Failed to load flash sales');
    }
}

function showFlashSaleBanner() {
    const banner = document.getElementById('flash-sale-banner');
    if (banner) {
        banner.style.display = 'block';
        
        const productNames = flashSaleProducts.map(p => p.name).join(', ');
        document.getElementById('flash-sale-text').textContent = 
            `Don't miss out! Flash sale on: ${productNames}`;
    }
}

function startFlashSaleTimer() {
    if (flashSaleInterval) clearInterval(flashSaleInterval);

    flashSaleInterval = setInterval(() => {
        updateFlashSaleTimers();
    }, 1000);
}

function updateFlashSaleTimers() {
    let allExpired = true;

    flashSaleProducts.forEach(product => {
        const endTime = new Date(product.flashSale.endTime);
        const now = new Date();
        const timeLeft = endTime - now;

        if (timeLeft > 0) {
            allExpired = false;
            
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            // Update timer display if product card exists
            const timerElement = document.querySelector(`[data-product-id="${product._id}"] .flash-timer`);
            if (timerElement) {
                timerElement.textContent = `⏰ ${hours}h ${minutes}m ${seconds}s`;
            }
        }
    });

    if (allExpired) {
        clearInterval(flashSaleInterval);
        hideFlashSaleBanner();
        // Reload products to update prices
        if (typeof loadProducts === 'function') {
            loadProducts();
        }
    }
}

function hideFlashSaleBanner() {
    const banner = document.getElementById('flash-sale-banner');
    if (banner) {
        banner.style.display = 'none';
    }
}

// Background task to check and disable expired flash sales
async function checkExpiredFlashSales() {
    flashSaleProducts.forEach(async (product) => {
        const endTime = new Date(product.flashSale.endTime);
        const now = new Date();

        if (endTime <= now && product.flashSale.isActive) {
            // In a real app, this would be handled by the backend
            console.log(`Flash sale expired for ${product.name}`);
        }
    });
}

// Initialize flash sales
loadFlashSales();

// Check every minute for expired sales
setInterval(checkExpiredFlashSales, 60000);
