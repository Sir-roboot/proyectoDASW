import FetchAuthentication from './FetchAuthentication.js';

const API_BASE = 'http://localhost:3000/CampingHouse';

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
        event.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Login fallido');
            }

            const data = await res.json();

            // Guardar tokens después de autenticarse
            localStorage.setItem(FetchAuthentication.ACCESS_TOKEN_NAME, data.accessToken);
            localStorage.setItem(FetchAuthentication.REFRESH_TOKEN_NAME, data.refreshToken);

            // Redirigir
            localStorage.setItem('userRole', data.role);
            window.location.href = './userIndex.html';

        } catch (err) {
            console.error('Error en login:', err.message);
            alert('Login fallido: ' + err.message);
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
                zipCode: document.getElementById('regZip').value,
                country: document.getElementById('regCountry').value
            }
        };

        try {
            const res = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (!res.ok) {
                // Muestra el mensaje del servidor (como "usuario ya existe")
                throw new Error(result.message || 'Error en el registro');
            }

            // Registro exitoso: mostrar formulario de login
            alert('Registro exitoso. Ahora inicia sesión.');

            // Mostrar login y ocultar registro
            document.getElementById('loginForm').style.display = 'block';
            document.getElementById('registerForm').style.display = 'none';

        } catch (error) {
            console.error('Registro fallido:', error.message);
            alert('Registro fallido: ' + error.message);
        }
    });
});
