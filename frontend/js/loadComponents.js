function loadComponent(selector, file) {
    const element = document.querySelector(selector);

    if (!element) {
        console.error(`Element ${selector} not found`);
        return;
    }

    return fetch(file)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.text();
        })
        .then(html => {
            element.innerHTML = html;
            console.log(`${file} loaded successfully`);

            // Re-attach event listeners after component loads
            attachHeaderEventListeners();
        })
        .catch(err => console.error(`Failed to load ${file}:`, err));
}

// Attach event listeners for header
function attachHeaderEventListeners() {
    const userMenu = document.getElementById('userMenu');
    const userDropdown = document.querySelector('.user-dropdown');
    const userSection = document.querySelector('.user-section');

    // Only attach if elements exist
    if (!userMenu || !userDropdown || !userSection) {
        return;
    }

    // Close dropdown when clicking outside
    document.removeEventListener('click', closeDropdownListener);
    document.addEventListener('click', closeDropdownListener);
}

function closeDropdownListener(event) {
    const userSection = document.querySelector('.user-section');
    if (userSection && !userSection.contains(event.target)) {
        const userMenu = document.getElementById('userMenu');
        const userDropdown = document.querySelector('.user-dropdown');

        if (userMenu && userDropdown) {
            userMenu.classList.remove('show');
            userDropdown.classList.remove('active');
        }
    }
}

// Toggle user dropdown menu
function toggleUserMenu() {
    const userMenu = document.getElementById('userMenu');
    const userDropdown = document.querySelector('.user-dropdown');

    if (!userMenu || !userDropdown) {
        console.error('User menu elements not found');
        return;
    }

    const isOpen = userMenu.classList.contains('show');

    if (isOpen) {

        userMenu.classList.remove('show');
        userDropdown.classList.remove('active');
        userMenu.style.position = '';
        userMenu.style.top = '';
        userMenu.style.left = '';
        userMenu.style.right = '';
        userMenu.style.zIndex = '';

    } else {

        userMenu.classList.add('show');
        userDropdown.classList.add('active');

        try {

            const rect = userDropdown.getBoundingClientRect();
            userMenu.style.position = 'fixed';
            userMenu.style.zIndex = '2000';
            const menuRect = userMenu.getBoundingClientRect();
            let left = rect.right - menuRect.width;
            if (left < 8) left = 8;
            userMenu.style.left = left + 'px';
            userMenu.style.top = rect.bottom + 8 + 'px';
            userMenu.style.right = 'auto';

        } catch (e) {
            console.warn('Could not position user menu:', e);
        }
    }
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('token');
        alert('You have been logged out successfully!');
        window.location.href = '/earist-leave-system/frontend/login.html';
    }
}

function checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (!token) {
        if (!window.location.href.includes('login.html')) {
            window.location.href = '/earist-leave-system/frontend/login.html';
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    checkAuthStatus();
    loadComponent("#header", "components/header.html");
    loadComponent("#sidebar", "components/sidebar.html");
    loadComponent("#footer", "components/footer.html");
});
