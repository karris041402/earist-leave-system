function loadComponent(selector, file) {
    const element = document.querySelector(selector);
    
    if (!element) {
        console.error(`Element ${selector} not found`);
        return;
    }
    
    fetch(file)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.text();
        })
        .then(html => {
            element.innerHTML = html;
            console.log(`${file} loaded successfully`);
        })
        .catch(err => console.error(`Failed to load ${file}:`, err));
}

document.addEventListener("DOMContentLoaded", () => {
    loadComponent("#header", "components/header.html");
    loadComponent("#sidebar", "components/sidebar.html");
    loadComponent("#footer", "components/footer.html");
});