import FetchAuthentication from './FetchAuthentication.js';
  
// Campos de perfil disponibles para edición
const editableFields = [
    'name', 'username', 'email', 'password',
    'street', 'city', 'state', 'zip', 'country'
];
  
document.addEventListener('DOMContentLoaded', async () => {
    FetchAuthentication.loadNavbar();
    // Referencias al DOM
    const profileDataContainer = document.getElementById('profileData');
    const historyBody = document.getElementById('salesHistory').querySelector('tbody');
  
    // Cargar datos de usuario
    try {
        const res = await fetch(`${FetchAuthentication.API_BASE}/profile`, {
            method: 'GET',
            mode: 'cors',
            headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        if (!res.ok) throw new Error(`Error perfil: ${res.status}`);
        const { user, history } = await res.json();
    
        // A) Inyectar datos en inputs (disabled)
        profileDataContainer.querySelectorAll('input').forEach(input => {
            const id = input.id.replace('edit', '').replace('Input', '').toLowerCase();
            if (user[id] !== undefined) input.value = user[id];
        });
    
        // B) Cargar historial de compras
        historyBody.innerHTML = '';
        history.forEach(order => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td>${new Date(order.date).toLocaleDateString()}</td>
            <td>$${order.total.toFixed(2)}</td>
            <td>${order.quantity}</td>
            <td><button class="btn btn-sm btn-info" data-order='${JSON.stringify(order)}' data-bs-toggle="modal" data-bs-target="#purchaseDetailModal">Ver</button></td>
            `;
            historyBody.appendChild(tr);
        });
  
    } 
    catch (err) {
        console.error('No se pudo cargar perfil:', err);
    }
  
    // Agregar listeners a cada modal de edición
    editableFields.forEach(field => {
        const modalId = `#edit${field.charAt(0).toUpperCase()+field.slice(1)}Modal`;
        const inputId = `edit${field.charAt(0).toUpperCase()+field.slice(1)}Input`;
        const saveBtn = document.querySelector(`${modalId} .btn-primary`);
        const input   = document.getElementById(inputId);
    
        if (saveBtn && input) {
            saveBtn.addEventListener('click', async () => {
            const value = input.value;
            try {
                const res = await fetch(`${FetchAuthentication.API_BASE}/profile`, {
                method: 'PATCH',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({ [field]: value })
                });
                if (!res.ok) throw new Error(`Error actualizando ${field}`);
                // actualizar input en vista principal
                const mainInput = Array.from(profileDataContainer.querySelectorAll('input'))
                .find(i => i.id === inputId.replace('edit', '').replace('Input', '').toLowerCase());
                // simpler: just close modal and reload page or reload profile
                location.reload();
            } catch (err) {
                console.error(`Error guardando ${field}:`, err);
            }
            });
        }
    });
  
    // 3️⃣ Detalle de orden en modal
    const purchaseDetailModal = document.getElementById('purchaseDetailModal');
    purchaseDetailModal.addEventListener('show.bs.modal', event => {
        const button = event.relatedTarget;
        const order  = JSON.parse(button.getAttribute('data-order'));
        const tbody  = document.getElementById('purchaseDetails');
        tbody.innerHTML = '';
        order.items.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${item.productName}</td>
                            <td>${item.quantity}</td>
                            <td>$${item.unitPrice.toFixed(2)}</td>
                            <td>$${(item.quantity*item.unitPrice).toFixed(2)}</td>`;
            tbody.appendChild(tr);
        });
    });
});
  