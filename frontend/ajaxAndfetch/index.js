import FetchAuthentication from './FetchAuthentication.js';

document.addEventListener('DOMContentLoaded', () => {
    FetchAuthentication.loadNavbar();

    // Referencias al DOM
    const propertiesContainer = document.getElementById('propertiesContainer');
    const pagination = document.getElementById('pagination');
    const searchForm = document.getElementById('searchForm');
    const modelInput = document.getElementById('modelInput');
    const priceSelect = document.getElementById('priceSelect');
    const categorySelect = document.getElementById('categorySelect');
    const carrusel = document.getElementById('carruselImages');

    // Parámetros de paginación
    let currentFilters = {};
    const pageSize = 6;
    let currentPage = 1;
    let allProducts = [];

    // 1. Carrusel: ¡estático! (no se toca en JS, solo en HTML)
    const imagenes = [
        "https://images.unsplash.com/photo-1496080174650-637e3f22fa03?q=80&w=1419&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ];

    // Si tienes URLs directas, reemplaza los links arriba con los tuyos

    let carruselHTML = "";

    imagenes.forEach((url, i) => {
        carruselHTML += `
            <div class="carousel-item${i === 0 ? ' active' : ''}">
            <img src="${url}" class="d-block w-100 imageCarousel" alt="Imagen ${i + 1}">
            </div>
        `;
    });

    carrusel.innerHTML = carruselHTML;

    // 1. Cargar categorías de la base de datos
    fetch(`${FetchAuthentication.API_BASE}/product/category`, { method: 'GET', headers: { Accept: 'application/json' } })
        .then(res => res.json())
        .then(data => {
            if (!data.success) throw new Error(data.error || 'No se pudieron obtener categorías');
            fillCategorySelect(data.categories);
        })
        .catch(err => console.error('Error cargando categorías:', err));

    // Llena el select dinámicamente y aplica Select2
    function fillCategorySelect(categories) {
        categorySelect.innerHTML = categories.map(cat =>
            `<option value="${cat._id}">${cat.name}</option>`
        ).join('');

        // Inicializa Select2
        $('#categorySelect').select2({
            placeholder: "Selecciona categorías",
            allowClear: true,
            width: '100%'
        });
    }

    // 2. Llenar las selecciones de filtros precios
    fetch(`${FetchAuthentication.API_BASE}/product/prices-range`, {
        method: 'GET',
        headers: { Accept: 'application/json' }
        })
        .then(res => res.json())
        .then(data => {
            if (!data.success) throw new Error(data.error || 'No se pudo obtener el rango de precios');
            fillPriceSelect(data.min, data.max);
        })
        .catch(err => console.error('Error cargando rango de precios:', err));

    // Función para llenar el select con los intervalos de precio
    function fillPriceSelect(min, max) {
        priceSelect.innerHTML = '<option value="">Precio Máx.</option>';
        // Por ejemplo
        for (let p = min; p <= max; p += 500) {
            const opt = document.createElement('option');
            opt.value = p;
            opt.textContent = `$${p.toLocaleString()}`;
            priceSelect.appendChild(opt);
        }
    }

    // 2. Cargar productos al entrar
    fetch(`${FetchAuthentication.API_BASE}/product`, { method: 'GET', headers: { Accept: 'application/json' } })
        .then(res => res.json())
        .then(data => {
            if (!data.success) throw new Error(data.error || 'No se pudieron obtener productos');
            allProducts = data.products;
            populateFilters(allProducts);
            renderPage(1);
            renderPagination(data.numElements, pageSize);
        })
        .catch(err => console.error('Error cargando productos:', err));

    // 3. Filtros dinámicos
    searchForm.addEventListener('submit', async e => {
        e.preventDefault();

        currentFilters = {}; // Reinicia filtros
        if (modelInput.value) currentFilters.model = modelInput.value;
        if (priceSelect.value) currentFilters.price = priceSelect.value;

        const categoriasSeleccionadas = $('#categorySelect').val();
        if (categoriasSeleccionadas && categoriasSeleccionadas.length > 0) {
            currentFilters.category = categoriasSeleccionadas.join(',');
        }

        currentPage = 1;
        await fetchAndRenderPage(currentPage);
    });

    async function fetchAndRenderPage(page) {
        const params = new URLSearchParams();

        // Aplica los filtros guardados
        for (const key in currentFilters) {
            if (currentFilters[key]) params.append(key, currentFilters[key]);
        }

        params.append('page', page);
        params.append('limit', pageSize);

        let url = `${FetchAuthentication.API_BASE}/product?${params.toString()}`;

        try {
            const res = await fetch(url, { method: 'GET', headers: { Accept: 'application/json' } });
            const data = await res.json();
            if (!data.success) throw new Error(data.error || 'Error en búsqueda');
            allProducts = data.products;
            renderPage(page);
            renderPagination(data.numElements, pageSize); // data.total: total de resultados filtrados

        } catch (err) {
            console.error('Error en búsqueda:', err);
        }
    }


    // Renderiza el grid de productos para la página actual
    function renderPage(page) {
        currentPage = page;
        propertiesContainer.innerHTML = '';
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        allProducts.slice(start, end).forEach(product => {
            // Manejo de imagen por URL; si no hay, imagen por defecto
            const image = (product.images && product.images[0]) ? product.images[0] : 'https://via.placeholder.com/400x300?text=Sin+Imagen';

            const col = document.createElement('div');
            col.className = 'col-md-4 mb-4';
            col.innerHTML = `
                <div class="card h-100">
                    <img src="${image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.category.name || ''}</p>
                        <p class="card-text">${product.price || ''}</p>
                    </div>
                    <div class="card-footer text-center">
                        <a href="productDetails.html?id=${product._id}" class="btn btn-primary">
                            Ver detalles
                        </a>
                    </div>
                </div>`;
            propertiesContainer.appendChild(col);
        });
    }

    // Render de paginación
    function renderPagination(totalItems, perPage) {
        pagination.innerHTML = '';
        const totalPages = Math.ceil(totalItems / perPage);
        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.className = `page-item${i === currentPage ? ' active' : ''}`;
            li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            li.addEventListener('click', e => {
                e.preventDefault();
                currentPage = i;
                fetchAndRenderPage(currentPage);
            });
            pagination.appendChild(li);
        }
    }
});
