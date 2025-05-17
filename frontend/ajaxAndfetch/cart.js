import FetchAuthentication from './FetchAuthentication.js';

document.addEventListener('DOMContentLoaded', () => {
    FetchAuthentication.loadNavbar();
    const cartContainer    = document.getElementById('cartItems');
    const summaryContainer = document.getElementById('cartSummary');
    const checkoutBtn      = document.getElementById('checkoutBtn');
    const clearCartBtn     = document.getElementById('clearCartBtn');

    clearCartBtn.addEventListener('click', vaciarCarrito);
    checkoutBtn.addEventListener('click', realizarCompra);

    async function cargarCarrito() {
        try {
            const res = await FetchAuthentication.fetchAuth(`${FetchAuthentication.API_BASE}/user/cart`);
            const data = await res.json();
            renderCart(data.cart.items || []);
        } catch (error) {
            console.error('Error al cargar el carrito:', error);
        }
    }

    function renderCart(items) {
        cartContainer.innerHTML = '';
        let subtotal = 0;

        items.forEach(item => {
            subtotal += item.price * item.quantity;
            const div = document.createElement('div');
            div.className = 'card mb-3 item-card';
            div.innerHTML = `
            <div class="row g-0">
                <div class="col-4">
                    <img src="${item.product.imageUrl}" alt="${item.product.name}" class="img-fluid rounded-start">
                </div>
                <div class="col-8">
                    <div class="card-body">
                        <h5 class="card-title">${item.product.name}</h5>
                        <p class="card-text text-muted">
                            Cantidad:
                            <input type="number" min="1" value="${item.quantity}"
                                   data-id="${item.product._id}"
                                   class="form-control form-control-sm w-auto d-inline-block quantity-input">
                        </p>
                        <p class="card-text"><small class="text-muted">Precio unitario: $${item.price}</small></p>
                        <button class="btn btn-sm btn-danger remove-item-btn" data-id="${item.product._id}">Eliminar</button>
                    </div>
                </div>
            </div>`;
            cartContainer.appendChild(div);
        });

        const tax = +(subtotal * 0.16).toFixed(2);
        const total = +(subtotal + tax).toFixed(2);

        summaryContainer.innerHTML = `
            <li class="list-group-item d-flex justify-content-between">Subtotal<span>$${subtotal.toFixed(2)}</span></li>
            <li class="list-group-item d-flex justify-content-between">Impuestos (16%)<span>$${tax}</span></li>
            <li class="list-group-item d-flex justify-content-between fw-bold">Total<span>$${total}</span></li>`;

        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', e => {
                const id = e.target.dataset.id;
                const qty = parseInt(e.target.value);
                if (qty > 0) actualizarCantidad(id, qty);
            });
        });

        document.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', () => eliminarProducto(btn.dataset.id));
        });
    }

    async function actualizarCantidad(productId, cantidad) {
        try {
            await FetchAuthentication.fetchAuth(`${FetchAuthentication.API_BASE}/user/cart/update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, quantity: cantidad })
            });
            cargarCarrito();
        } catch (err) {
            console.error('Error al actualizar cantidad:', err);
        }
    }

    async function eliminarProducto(productId) {
        try {
            await FetchAuthentication.fetchAuth(`${FetchAuthentication.API_BASE}/user/cart/remove/${productId}`, {
                method: 'DELETE'
            });
            cargarCarrito();
        } catch (err) {
            console.error('Error al eliminar producto:', err);
        }
    }

    async function vaciarCarrito() {
        try {
            await FetchAuthentication.fetchAuth(`${FetchAuthentication.API_BASE}/user/cart/clean`, {
                method: 'DELETE'
            });
            cargarCarrito();
        } catch (err) {
            console.error('Error al vaciar carrito:', err);
        }
    }

    async function realizarCompra() {
        try {
            const res = await FetchAuthentication.fetchAuth(`${FetchAuthentication.API_BASE}/user/cart/purchase`, {
                method: 'POST'
            });
            const result = await res.json();
            if (res.ok) {
                alert('Compra realizada con éxito');
                cargarCarrito();
            } else {
                alert('Error al comprar: ' + result.message);
            }
        } catch (err) {
            console.error('Error al procesar compra:', err);
        }
    }

    cargarCarrito();
});
