import FetchAuthentication from './FetchAuthentication.js';

// 🌐 URL base de tu API (ajústala según tu configuración)
const API_BASE = 'http://localhost:3000/api';

// Espera a que cargue el DOM para enganchar formularios y botones
document.addEventListener('DOMContentLoaded', () => {

    // ————————————————————————————————
    // 0) LÓGICA DE TOGGLE LOGIN / REGISTER
    // ————————————————————————————————
    const loginBtn      = document.getElementById('loginBtn');
    const registerBtn   = document.getElementById('registerBtn');
    const loginFormBox  = document.getElementById('loginForm');
    const registerFormBox = document.getElementById('registerForm');

    loginBtn.addEventListener('click', () => {
        loginFormBox.style.display    = 'block';
        registerFormBox.style.display = 'none';
    });
    registerBtn.addEventListener('click', () => {
        registerFormBox.style.display = 'block';
        loginFormBox.style.display    = 'none';
    });

    // Obtiene los formularios dentro de los contenedores que ya tienes
    const loginForm = document.querySelector('#loginForm form');
    const registerForm = document.querySelector('#registerForm form');

    // ————————————————————————————————
    // 1) LOGIN
    // ————————————————————————————————
    loginForm.addEventListener('submit', async event => {
        event.preventDefault(); // evita que recargue la página

        // 1️⃣ Captura datos del formulario
        const email     = document.getElementById('loginEmail').value;
        const password  = document.getElementById('loginPassword').value;

        try {
            // 2️⃣ Lanza la petición POST al endpoint de login
            const res = await FetchAuthentication.fetchAuth(`${API_BASE}/auth/login`, {
                method: 'POST',                    
                mode: 'cors',                      
                headers: {
                    'Content-Type': 'application/json'  
                },
                body: JSON.stringify({ email, password }) // convierte a JSON
            });

            // 3️⃣ Control de errores HTTP
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Error en el login');
            }

            // 6️⃣ Redirige o actualiza la UI
            window.location.href = './userIndex.html';
        } 
        catch (error) {
            console.error('Login fallido:', error);
            alert('Login fallido: ' + error.message);
        }
    });

    // ————————————————————————————————
    // 2) SIGN UP
    // ————————————————————————————————
    registerForm.addEventListener('submit', async event => {
        event.preventDefault();

        // 1️⃣ Construye el objeto con TODOS tus campos
        const data = {
            name:      document.getElementById('regName').value,
            userName:  document.getElementById('regUserName').value,
            email:     document.getElementById('regEmail').value,
            password:  document.getElementById('regPassword').value,
            address: {
                street:  document.getElementById('regStreet').value,
                city:    document.getElementById('regCity').value,
                state:   document.getElementById('regState').value,
                zipCode:     document.getElementById('regZip').value,
                country: document.getElementById('regCountry').value
            }
        };

        try {
            // 2️⃣ POST al endpoint de registro
            const res = await FetchAuthentication.fetchSetParms(`${API_BASE}/auth/register`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            // 3️⃣ Error handling
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Error en el registro');
            }


            // 5️⃣ Opcional: guardar token y redirigir
            const data = await res.json();

            if (!data.noneExistUser) {
                window.location.href = './userIndex.html';
            } else {
                alert('Usuario ya existente, por favor haz login.');
                // muestra el formulario de login
                document.getElementById('loginForm').style.display = 'block';
                document.getElementById('registerForm').style.display = 'none';
            }
        } 
        catch (error) {
            console.error('Registro fallido:', error);
            alert('Registro fallido: ' + error.message);
        }
    });
});
