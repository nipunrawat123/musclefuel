// script.js

let cartCount = 0;
let cartTotal = 0;
let cartItems = [];

// Show/hide cart dropdown
const cart = document.querySelector('.cart');
const cartDropdown = document.getElementById('cart-dropdown');
cart.addEventListener('mouseenter', () => cartDropdown.style.display = 'block');
cart.addEventListener('mouseleave', () => cartDropdown.style.display = 'none');

// Toast function
function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.innerText = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Update cart display
function updateCart() {
    const cartList = document.getElementById('cart-items');
    cartList.innerHTML = '';
    cartItems.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${item.name} - ${item.price} x ${item.quantity} 
            <button onclick="removeItem(${index})">Remove</button>`;
        cartList.appendChild(li);
    });
    document.getElementById('cart-count').innerText = cartCount;
    document.getElementById('cart-total').innerText = `₹${cartTotal.toLocaleString()}`;
}

// Remove item from cart
function removeItem(index) {
    const price = parseInt(cartItems[index].price.replace(/₹|,/g, ''));
    const quantity = cartItems[index].quantity;
    cartTotal -= price * quantity;
    cartCount -= quantity;
    cartItems.splice(index, 1);
    updateCart();
    showToast('Item removed from cart');
}

// Smooth scroll for shop button
const shopBtn = document.querySelector('.primary');
if(shopBtn){
    shopBtn.addEventListener('click', () => {
        document.querySelector('.collection').scrollIntoView({ behavior: 'smooth' });
    });
}

// Modal elements
const modal = document.getElementById('product-modal');
const modalImg = document.getElementById('modal-img');
const modalName = document.getElementById('modal-name');
const modalDesc = document.getElementById('modal-desc');
const modalPrice = document.getElementById('modal-price');
const modalAddBtn = document.getElementById('modal-add-btn');
const closeModal = document.querySelector('.modal .close');
const modalQuantitySpan = document.getElementById('modal-quantity');
const increaseBtn = document.getElementById('increase-qty');
const decreaseBtn = document.getElementById('decrease-qty');

// Open modal
document.querySelectorAll('.card').forEach(card => {
    const priceEl = card.querySelector('.price');

    card.addEventListener('click', () => {
        modal.style.display = 'block';
        modalImg.src = card.dataset.img;
        modalName.innerText = card.dataset.name;
        modalDesc.innerText = card.dataset.desc;
        modalPrice.innerText = priceEl.innerText;
        modalQuantitySpan.innerText = '1';
    });

    // Hover price effect
    if(priceEl){
        card.addEventListener('mouseenter', () => priceEl.style.color = '#fff');
        card.addEventListener('mouseleave', () => priceEl.style.color = '#f0b90b');
    }
});

// Modal quantity buttons
increaseBtn.addEventListener('click', () => {
    let qty = parseInt(modalQuantitySpan.innerText);
    qty++;
    modalQuantitySpan.innerText = qty;
});
decreaseBtn.addEventListener('click', () => {
    let qty = parseInt(modalQuantitySpan.innerText);
    if(qty > 1) qty--;
    modalQuantitySpan.innerText = qty;
});

// Close modal
closeModal.onclick = () => modal.style.display = 'none';
window.onclick = (e) => { if(e.target == modal) modal.style.display = 'none'; };

// Add to cart from modal
modalAddBtn.addEventListener('click', () => {
    const quantity = parseInt(modalQuantitySpan.innerText);
    const price = parseInt(modalPrice.innerText.replace(/₹|,/g, ''));
    const totalPrice = price * quantity;

    cartCount += quantity;
    cartTotal += totalPrice;
    cartItems.push({
        name: modalName.innerText,
        price: modalPrice.innerText,
        quantity: quantity
    });

    updateCart();
    showToast(`Added ${quantity} x ${modalName.innerText} to cart`);
    modalQuantitySpan.innerText = '1';
    modal.style.display = 'none';
});

// Checkout button
document.getElementById('checkout-btn').addEventListener('click', () => {
    if(cartItems.length === 0){
        showToast('Your cart is empty!');
        return;
    }
    showToast(`Thank you for your purchase! Total: ₹${cartTotal.toLocaleString()}`);
    cartItems = [];
    cartCount = 0;
    cartTotal = 0;
    updateCart();
});
