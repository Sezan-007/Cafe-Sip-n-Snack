document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // --- FEATURE 1: Form Validation ---
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            // Prevent the page from reloading when you hit submit
            event.preventDefault();
            event.stopPropagation();
            
            let isValid = true;
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');

            // 1. Check Name
            if (name.value.trim() === '') {
                name.classList.add('is-invalid');
                isValid = false;
            } else {
                name.classList.remove('is-invalid');
            }

            // 2. Check Email (Simple Regex)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value)) {
                email.classList.add('is-invalid');
                isValid = false;
            } else {
                email.classList.remove('is-invalid');
            }

            // 3. Check Message
            if (message.value.trim() === '') {
                message.classList.add('is-invalid');
                isValid = false;
            } else {
                message.classList.remove('is-invalid');
            }

            // If everything is filled out correctly...
            if (isValid) {
                // Show the success message by removing 'd-none'
                const successMessage = document.getElementById('formSuccess');
                successMessage.classList.remove('d-none');
                
                // Clear the form fields
                contactForm.reset();
                
                // Hide the success message again after 3 seconds
                setTimeout(() => {
                    successMessage.classList.add('d-none');
                }, 3000);
            }
        });
    }

    // ==========================================
    // --- FEATURE 2: LocalStorage Shopping Cart ---
    // ==========================================
    
    // Load cart safely, reset if corrupted
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('sipSnackCart')) || [];
    } catch (e) {
        cart = [];
        localStorage.removeItem('sipSnackCart');
    }
    
    function updateCartUI() {
        const cartCountElement = document.getElementById('cart-count');
        const cartContainer = document.getElementById('cart-items-container');
        const cartTotalElement = document.getElementById('cart-total');
        
        // Update the red badge total count
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }
        
        // Render items inside the modal
        if (cartContainer && cartTotalElement) {
            if (cart.length === 0) {
                cartContainer.innerHTML = '<p class="text-muted">Your cart is empty.</p>';
                cartTotalElement.textContent = '£0.00';
            } else {
                let html = '<ul class="list-group mb-3">';
                let totalPrice = 0;
                
                cart.forEach((item, index) => {
                    const itemTotal = item.price * item.qty;
                    totalPrice += itemTotal;
                    
                    html += `
                        <li class="list-group-item d-flex justify-content-between align-items-center lh-sm">
                            <div>
                                <h6 class="my-0">${item.name} <span class="badge bg-secondary ms-2">x${item.qty}</span></h6>
                                <small class="text-muted">£${item.price.toFixed(2)} each</small>
                            </div>
                            <div class="d-flex align-items-center">
                                <span class="fw-bold me-3">£${itemTotal.toFixed(2)}</span>
                                <button class="btn btn-sm btn-outline-danger remove-item" data-index="${index}">X</button>
                            </div>
                        </li>
                    `;
                });
                
                html += '</ul>';
                cartContainer.innerHTML = html;
                cartTotalElement.textContent = `£${totalPrice.toFixed(2)}`;
            }
        }
    }

    // Initialize the UI on page load
    updateCartUI();

    // Add to Cart Logic
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    addToCartBtns.forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            
            // Check if item exists in cart
            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.qty += 1;
            } else {
                cart.push({ name: name, price: price, qty: 1 });
            }
            
            localStorage.setItem('sipSnackCart', JSON.stringify(cart));
            updateCartUI();
            
            // Button feedback
            const originalText = button.textContent;
            button.textContent = "Added!";
            button.classList.add('btn-success');
            button.classList.remove('btn-custom');
            
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('btn-success');
                button.classList.add('btn-custom');
            }, 1000);
        });
    });

    // Remove Individual Item Logic (Event Delegation)
    const cartContainer = document.getElementById('cart-items-container');
    if (cartContainer) {
        cartContainer.addEventListener('click', function(e) {
            // Check if the clicked element is our remove button
            if (e.target.classList.contains('remove-item')) {
                const itemIndex = e.target.getAttribute('data-index');
                
                // Remove 1 item from the array at that exact index
                cart.splice(itemIndex, 1);
                
                // Save updated cart and refresh UI
                localStorage.setItem('sipSnackCart', JSON.stringify(cart));
                updateCartUI();
            }
        });
    }

    // Clear Entire Cart Logic
    const clearCartBtn = document.getElementById('clear-cart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            cart = []; 
            localStorage.setItem('sipSnackCart', JSON.stringify(cart)); 
            updateCartUI(); 
        });
    }
});
