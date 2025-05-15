async function loadNavbar() {
    try {
        const resp = await fetch('./navbar.html');
        const html = await resp.text();
        document.getElementById('navbar-placeholder').innerHTML = html;
        console.log(document.getElementById('logoutBtn'))
        // ✅ Inyecta manualmente navbar.js DESPUÉS de insertar el HTML
        const script = document.createElement('script');
        script.src = '../ajaxAndfetch/navbar.js';
        script.onload = () => {
            // Si quieres puedes llamar aquí a funciones específicas si navbar.js las define globalmente
            console.log('navbar.js cargado y ejecutado correctamente');
        };
        document.body.appendChild(script);
    } catch (err) {
        console.error('Error al cargar el navbar:', err);
    }
}

loadNavbar();
  
// 🌐 URL base de tu API
const API_BASE = 'http://localhost:3000/api';
  
// Estado del carrito en memoria
let cartItems = [];
  
document.addEventListener('DOMContentLoaded', () => {
    const cartContainer   = document.getElementById('cartItems');
    const summaryContainer= document.getElementById('cartSummary');
    const checkoutBtn     = document.getElementById('checkoutBtn');
    const clearCartBtn    = document.getElementById('clearCartBtn');
  
    // 1️⃣ Cargar carrito desde localStorage o backend
    const saved = localStorage.getItem('cart');
    cartItems = saved ? JSON.parse(saved) : [];
    renderCart();
  
    // 2️⃣ Renderizar carrito y resumen
    function renderCart() {
        cartContainer.innerHTML = '';
        let subtotal = 0;
    
        cartItems.forEach(item => {
            subtotal += item.price * item.quantity;
            const div = document.createElement('div');
            div.className = 'card mb-3 item-card';
            div.innerHTML = `
            <div class="row g-0">
                <div class="col-4"><img src="${item.image}" alt="${item.name}" class="img-fluid rounded-start"></div>
                <div class="col-8">
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text text-muted">Cantidad: <input type="number" min="1" value="${item.quantity}" data-id="${item.id}" class="form-control form-control-sm w-auto d-inline-block quantity-input"></p>
                    <p class="card-text"><small class="text-muted">Precio unitario: $${item.price}</small></p>
                    <button class="btn btn-sm btn-danger remove-item-btn" data-id="${item.id}">Eliminar</button>
                </div>
                </div>
            </div>`;
            cartContainer.appendChild(div);
        });
    
        // Calcular impuestos y total
        const tax = +(subtotal * 0.16).toFixed(2);
        const total = +(subtotal + tax).toFixed(2);
    
        summaryContainer.innerHTML = `
            <li class="list-group-item d-flex justify-content-between">Subtotal<span>$${subtotal.toFixed(2)}</span></li>
            <li class="list-group-item d-flex justify-content-between">Impuestos (16%)<span>$${tax}</span></li>
            <li class="list-group-item d-flex justify-content-between fw-bold">Total<span>$${total}</span></li>`;
    
        // Listeners para inputs y botones
        document.querySelectorAll('.quantity-input').forEach(input => {
                input.addEventListener('change', e => {
                const id = e.target.dataset.id;
                const qty = parseInt(e.target.value);
                updateQuantity(id, qty);
            });
        });
        
        document.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                const id = e.target.dataset.id;
                removeItem(id);
            });
        });
    
        // Guardar en localStorage
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  
    // 3️⃣ Funciones de actualización
    function updateQuantity(id, qty) {
        cartItems = cartItems.map(item => item.id === id ? { ...item, quantity: qty } : item);
        renderCart();
    }
  
    function removeItem(id) {
        cartItems = cartItems.filter(item => item.id !== id);
        renderCart();
    }
  
    // 4️⃣ Vaciar carrito
    clearCartBtn.addEventListener('click', () => {
        cartItems = [];
        renderCart();
    });
  
    // 5️⃣ Proceder al pago
    checkoutBtn.addEventListener('click', async () => {
        if (!cartItems.length) return alert('Tu carrito está vacío');
        try {
            const res = await fetch(`${API_BASE}/user/cart/checkout`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({ items: cartItems })
            });
            if (!res.ok) throw new Error(`Error checkout: ${res.status}`);
            const result = await res.json();
            alert('Compra realizada con éxito: ' + result.orderId);
            cartItems = [];
            renderCart();
        } catch (err) {
            console.error('Error al procesar compra:', err);
            alert('No se pudo completar la compra');
        }
    });
});
  