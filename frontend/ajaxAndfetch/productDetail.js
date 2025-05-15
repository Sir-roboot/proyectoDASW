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
    
document.addEventListener('DOMContentLoaded', async () => {
    // Obtener ID de query string
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return console.error('No se proporcionó ID de propiedad');
    
    try {
        // 1️⃣ Petición para obtener detalles
        const res = await fetch(`${API_BASE}/product/${id}`, {
            method: 'GET',
            mode: 'cors',
            headers: { 'Accept': 'application/json' }
        });
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        const house = await res.json();
    
        // 2️⃣ Inyectar breadcrumb
        document.getElementById('bc-name').textContent = house.title;
    
        // 3️⃣ Inyectar datos principales
        document.getElementById('prod-name').textContent        = house.title;
        document.getElementById('prod-location').textContent    = `${house.city}, ${house.state}`;
        document.getElementById('prod-price').textContent       = `$${house.price}`;
        document.getElementById('prod-description').textContent = house.description;
    
        // 4️⃣ Inyectar imágenes en carousel
        const carouselInner = document.getElementById('carouselInner');
        carouselInner.innerHTML = '';
        house.images.forEach((imgUrl, idx) => {
            const div = document.createElement('div');
            div.className = 'carousel-item' + (idx === 0 ? ' active' : '');
            const ima = document.createElement('img')
            ima.src = imgUrl
            ima.className = "d-block w-100 carousel-img"
            ima.alt = house.title
            div.innerHTML.appendChild(ima)
            //div.innerHTML = `<img src="${imgUrl}" class="d-block w-100 carousel-img" alt="${house.title}">`;
            carouselInner.appendChild(div);
        });
    
        // 5️⃣ Cantidad máxima según disponibilidad
        const quantitySelect = document.getElementById('quantity');
        quantitySelect.innerHTML = '';
        const maxQty = house.stock;
        for(let i = 0; i <= Math.min(maxQty, 10); i++) {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = i;
            quantitySelect.appendChild(opt);
        }
       
        // 6️⃣ Botones: agregar al carrito y comprar ahora
        document.getElementById('addCart').addEventListener('click', async () => {
            // Aquí metes tu lógica de carrito, p.ej fetch POST /api/user/cart

            await fetch(`${API_BASE}/user/cart/add`,{
                    method: 'POST',             // 🚀 Puede ser 'GET', 'POST', 'PUT', 'PATCH', 'DELETE', etc.
                    mode: 'cors',               // 🌐 Habilita CORS
                    credentials: 'include',     // 🔐 (opcional) 'omit' | 'same-origin' | 'include'
                    headers: {
                        'Content-Type': 'application/json',        // Tipo de contenido
                        'Authorization': `Bearer ${tuToken}`,      // Tu token JWT u otro esquema
                        'Accept': 'application/json'               // Qué tipo de respuesta aceptas
                    },
                    body: JSON.stringify({       // 📦 Solo para métodos con body (POST, PUT, PATCH)
                        productId:,
                        amount:
                    })
            });
            console.log(`Añadir al carrito: id=${id}, qty=${quantitySelect.value}`);
        });

        document.getElementById('buyNow').addEventListener('click', () => {
            // Lógica de compra inmediata
            console.log(`Comprar ahora: id=${id}, qty=${quantitySelect.value}`);
        });
    } 
    catch (err) {
        console.error('Error cargando detalles:', err);
    }
});
    