import FetchAuthentication from './FetchAuthentication.js';

async function loadNavbar() {
    try {
        const resp = await fetch('./navbar.html');
        const html = await resp.text();
        document.getElementById('navbar-placeholder').innerHTML = html;
        console.log(document.getElementById('logoutBtn'))
        // Inyecta manualmente navbar.js DESPUÉS de insertar el HTML
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
    

const API_BASE = 'http://localhost:3000/CampingHouse';

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return console.error('No se proporcionó ID de producto');

    try {
        // Obtener detalles del producto
        const res = await fetch(`${API_BASE}/product/${id}`, {
            method: 'GET',
            mode: 'cors',
            headers: { 'Accept': 'application/json' }
        });

        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        const product = await res.json();

        // Inyectar datos en el HTML
        document.getElementById('bc-name').textContent = product.name;
        document.getElementById('prod-name').textContent = product.name;
        document.getElementById('prod-location').textContent = product.brand;
        document.getElementById('prod-price').textContent = `$${product.price}`;
        document.getElementById('prod-description').textContent = product.description;

        // Inyectar imágenes
        const carouselInner = document.getElementById('carouselInner');
        carouselInner.innerHTML = '';
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
                const response = await FetchAuthentication.fetchAuth(`${API_BASE}/user/cart/add`, {
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
                console.error('Error al agregar al carrito:', err);
                alert('Ocurrió un error al agregar al carrito');
            }
        });

    } catch (err) {
        console.error('Error cargando detalles del producto:', err);
    }
});

    