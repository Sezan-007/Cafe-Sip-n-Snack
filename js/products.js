document.addEventListener('DOMContentLoaded', () => {
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
        
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }
        
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

    updateCartUI();

    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    addToCartBtns.forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            
            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.qty += 1;
            } else {
                cart.push({ name: name, price: price, qty: 1 });
            }
            
            localStorage.setItem('sipSnackCart', JSON.stringify(cart));
            updateCartUI();
            
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

    const cartContainer = document.getElementById('cart-items-container');
    if (cartContainer) {
        cartContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-item')) {
                const itemIndex = e.target.getAttribute('data-index');
                cart.splice(itemIndex, 1);
                localStorage.setItem('sipSnackCart', JSON.stringify(cart));
                updateCartUI();
            }
        });
    }

    const clearCartBtn = document.getElementById('clear-cart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            cart = []; 
            localStorage.setItem('sipSnackCart', JSON.stringify(cart)); 
            updateCartUI(); 
        });
    }
});