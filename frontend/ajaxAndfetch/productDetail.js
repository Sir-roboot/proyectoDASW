import FetchAuthentication from './FetchAuthentication.js';

document.addEventListener('DOMContentLoaded', async () => {
    FetchAuthentication.loadNavbar();
    
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return console.error('No se proporcionó ID de producto');

    try {
        // Obtener detalles del producto
        const res = await fetch(`${FetchAuthentication.API_BASE}/product/${id}`, {
            method: 'GET',
            mode: 'cors',
            headers: { 'Accept': 'application/json' }
        });

        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        const product = await res.json();

        const loginMessage = document.getElementById('loginMessage');

        // Inyectar datos en el HTML
        document.getElementById('bc-name').textContent = product.name;
        document.getElementById('prod-name').textContent = product.name;
        document.getElementById('prod-location').textContent = product.brand;
        document.getElementById('prod-price').textContent = `$${product.price}`;
        document.getElementById('prod-description').textContent = product.description;

        // Inyectar imágenes
        const carouselInner = document.getElementById('carouselInner');
        carouselInner.innerHTML = '';
        if (product.images && product.images.length) {
            product.images.forEach((imgUrl, idx) => {
                const div = document.createElement('div');
                div.className = 'carousel-item' + (idx === 0 ? ' active' : '');
                const img = document.createElement('img');
                img.src = imgUrl;
                img.className = "d-block w-100 carousel-img";
                img.alt = product.name;
                div.appendChild(img);
                carouselInner.appendChild(div);
            });
        } else {
            // Imagen placeholder
            const div = document.createElement('div');
            div.className = 'carousel-item active';
            const img = document.createElement('img');
            img.src = 'https://via.placeholder.com/400x300?text=Sin+Imagen';
            img.className = "d-block w-100 carousel-img";
            img.alt = 'Sin imagen';
            div.appendChild(img);
            carouselInner.appendChild(div);
        }

        // Inyectar opciones de cantidad
        const quantitySelect = document.getElementById('quantity');
        quantitySelect.innerHTML = '';
        for (let i = 1; i <= Math.min(product.stock, 10); i++) {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = i;
            quantitySelect.appendChild(opt);
        }

        // Agregar al carrito
        document.getElementById('addCart').addEventListener('click', async () => {
            const quantity = parseInt(quantitySelect.value);
            if (isNaN(quantity) || quantity <= 0) {
                return alert('Selecciona una cantidad válida');
            }

            try {
                const response = await FetchAuthentication.fetchAuth(`${FetchAuthentication.API_BASE}/user/cart/add`, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        productId: id,
                        amount: quantity
                    })
                });

                if (!response.ok) throw new Error('No se pudo agregar al carrito');
                alert('Producto agregado al carrito exitosamente');
            } catch (err) {
                loginMessage.textContent = err.message || 'Error al enviar la peticion.';
                loginMessage.className = 'alert alert-danger';
                loginMessage.classList.remove('d-none');
                setTimeout(() => loginMessage.classList.add('d-none'), 3000);
            }
        });

    } catch (err) {
        console.error('Error cargando detalles del producto:', err);
    }
});

    