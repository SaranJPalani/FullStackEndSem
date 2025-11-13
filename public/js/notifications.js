const API_URL = 'http://localhost:5000/api';
const token = localStorage.getItem('token');

let notificationInterval = null;
let unreadCount = 0;

async function loadNotifications() {
    if (!token) return;

    try {
        const response = await fetch(`${API_URL}/notifications`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            displayNotifications(data.data);
            updateNotificationBadge(data.unreadCount);
        }
    } catch (error) {
        console.error('Failed to load notifications');
    }
}

function displayNotifications(notifications) {
    const listEl = document.getElementById('notification-list');
    if (!listEl) return;

    if (notifications.length === 0) {
        listEl.innerHTML = '<div class="notification-empty">No notifications</div>';
        return;
    }

    const html = notifications.map(notification => `
        <div class="notification-item ${notification.isRead ? 'read' : 'unread'}" 
             onclick="markAsRead('${notification._id}', '${notification.link || ''}')">
            <div class="notification-icon">${getNotificationIcon(notification.type)}</div>
            <div class="notification-content">
                <p>${notification.message}</p>
                <small>${formatDate(notification.createdAt)}</small>
            </div>
            ${!notification.isRead ? '<div class="unread-dot"></div>' : ''}
        </div>
    `).join('');

    listEl.innerHTML = html;
}

function getNotificationIcon(type) {
    const icons = {
        'order': '📦',
        'stock': '📊',
        'flash_sale': '⚡',
        'general': '🔔'
    };
    return icons[type] || '🔔';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}

function updateNotificationBadge(count) {
    unreadCount = count;
    const bellEl = document.getElementById('notification-bell');
    const countEl = document.getElementById('notification-count');

    if (bellEl && token) {
        bellEl.style.display = 'flex';
        
        if (countEl) {
            countEl.textContent = count;
            countEl.style.display = count > 0 ? 'inline' : 'none';
        }
    }
}

async function markAsRead(notificationId, link) {
    try {
        await fetch(`${API_URL}/notifications/${notificationId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        loadNotifications();

        if (link) {
            window.location.href = link;
        }
    } catch (error) {
        console.error('Failed to mark as read');
    }
}

async function markAllAsRead() {
    try {
        await fetch(`${API_URL}/notifications/mark-all-read`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        loadNotifications();
    } catch (error) {
        console.error('Failed to mark all as read');
    }
}

// Toggle notification panel
document.getElementById('notification-bell')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const panel = document.getElementById('notification-panel');
    if (panel) {
        panel.classList.toggle('active');
    }
});

// Close panel when clicking outside
document.addEventListener('click', (e) => {
    const panel = document.getElementById('notification-panel');
    const bell = document.getElementById('notification-bell');
    
    if (panel && bell && !panel.contains(e.target) && !bell.contains(e.target)) {
        panel.classList.remove('active');
    }
});

// Mark all as read button
document.getElementById('mark-all-read')?.addEventListener('click', markAllAsRead);

// Initialize
if (token) {
    loadNotifications();
    
    // Poll for new notifications every 5 seconds
    notificationInterval = setInterval(loadNotifications, 5000);
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (notificationInterval) {
        clearInterval(notificationInterval);
    }
});
