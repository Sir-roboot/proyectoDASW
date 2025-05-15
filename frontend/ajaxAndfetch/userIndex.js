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
  
document.addEventListener('DOMContentLoaded', () => {
    // Referencias al DOM
    const carouselInner       = document.querySelector('#carouselExample .carousel-inner');
    const propertiesContainer = document.getElementById('propertiesContainer');
    const pagination          = document.getElementById('pagination');
    const searchForm          = document.getElementById('searchForm');
    const modelInput          = document.getElementById('modelInput');
    const modelsList          = document.getElementById('modelsList');
    const priceSelect         = document.getElementById('priceSelect');
    const sizeSelect          = document.getElementById('sizeSelect');

    // Parámetros de paginación
    const pageSize    = 6;
    let   currentPage = 1;
    let   allHouses   = [];

    // 1️⃣ Petición inicial para obtener todos los datos
    //    Este fetch carga todos los inmuebles al entrar a la página
    fetch(`${API_BASE}/houses`, {
        method: 'GET',
        mode: 'cors',
        headers: { 'Accept': 'application/json' }
    })
    .then(res => {
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        return res.json();
    })
    .then(houses => {
        allHouses = houses;
        // Poblar selectores y datalist con valores únicos de los datos
        populateFilters(houses);
        // Render inicial de carrusel y cards
        populateCarousel(houses);
        renderPage(1);
        renderPagination(houses.length, pageSize);
    })
    .catch(err => console.error('Error cargando datos iniciales:', err));

    // 2️⃣ Manejo de búsqueda y filtros
    searchForm.addEventListener('submit', async e => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (modelInput.value)   params.append('model', modelInput.value);
        if (priceSelect.value)  params.append('priceMax', priceSelect.value);
        if (sizeSelect.value)   params.append('sizeMin', sizeSelect.value);

        // Si no hay filtros, q estará vacío, por lo que fetch recupera todo de nuevo
        let url = `${API_BASE}/houses`;
        const q = params.toString();
        if (q) url += `?${q}`;

        try {
            const res = await fetch(url, {
                method: 'GET',
                mode: 'cors',
                headers: { 'Accept': 'application/json' }
            });
            if (!res.ok) throw new Error(`Error en búsqueda: ${res.status}`);
            const filtered = await res.json();
            allHouses = filtered;
            // Re-render con resultados filtrados o todos si no hubo filtros
            populateCarousel(filtered);
            renderPage(1);
            renderPagination(filtered.length, pageSize);
        } catch (err) {
            console.error('Error en búsqueda:', err);
        }
    });

    // ————————————————————————————————
    // Función: poblar filtros dinámicos
    //  Rellena el datalist y selects antes de usar filtros
    // ————————————————————————————————
    function populateFilters(houses) {
        const uniqueModels = [...new Set(houses.map(h => h.model))].sort();
        modelsList.innerHTML = '';
        uniqueModels.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m;
            modelsList.appendChild(opt);
        });
        const uniquePrices = [...new Set(houses.map(h => h.price))].sort((a,b)=>a-b);
        priceSelect.innerHTML = '<option value="">Precio Máx.</option>';
        uniquePrices.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p;
            opt.textContent = `$${p}`;
            priceSelect.appendChild(opt);
        });
        const uniqueSizes = [...new Set(houses.map(h => h.size))].sort((a,b)=>a-b);
        sizeSelect.innerHTML = '<option value="">Tamaño mín.</option>';
        uniqueSizes.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s;
            opt.textContent = `${s} m²`;
            sizeSelect.appendChild(opt);
        });
    }

    // ————————————————————————————————
    // Función: inyectar el carrusel
    // ————————————————————————————————
    function populateCarousel(houses) {
        carouselInner.innerHTML = '';
        houses.forEach((house, i) => {
            const item = document.createElement('div');
            item.className = 'carousel-item' + (i === 0 ? ' active' : '');
            item.innerHTML = `
                <img src="${house.imageUrl}" class="d-block w-100 imageCarousel" alt="${house.title}">
                <div class="carousel-caption d-none d-md-block">
                    <h5>${house.title}</h5>
                    <p>${house.description}</p>
                </div>`;
            carouselInner.appendChild(item);
        });
    }

    // ————————————————————————————————
    // Funciones de paginación y renderizado de cards
    // ————————————————————————————————
    function renderPage(page) {
        currentPage = page;
        propertiesContainer.innerHTML = '';
        const start = (page - 1) * pageSize;
        const end   = start + pageSize;
        allHouses.slice(start, end).forEach(house => {
            const col = document.createElement('div');
            col.className = 'col-md-4 mb-4';
            col.innerHTML = `
                <div class="card h-100">
                    <img src="${house.imageUrl}" class="card-img-top" alt="${house.title}">
                    <div class="card-body">
                        <h5 class="card-title">${house.title}</h5>
                        <p class="card-text">${house.shortDesc}</p>
                    </div>
                    <div class="card-footer text-center">
                        <a href="productDetails.html?id=${house.id}" class="btn btn-primary">
                            Ver detalles
                        </a>
                    </div>
                </div>`;
            propertiesContainer.appendChild(col);
        });
    }

    function renderPagination(totalItems, perPage) {
        pagination.innerHTML = '';
        const totalPages = Math.ceil(totalItems / perPage);
        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.className = `page-item${i === currentPage ? ' active' : ''}`;
            li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            li.addEventListener('click', e => {
                e.preventDefault();
                renderPage(i);
                renderPagination(totalItems, perPage);
            });
            pagination.appendChild(li);
        }
    }
});
