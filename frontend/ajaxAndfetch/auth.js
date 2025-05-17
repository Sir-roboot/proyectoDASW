import FetchAuthentication from './FetchAuthentication.js';

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
        const loginMessage = document.getElementById('loginMessage');
        const loginFormElement = document.getElementById('loginForm');

        try {
            const res = await FetchAuthentication.fetchAuthSetParameters(`${FetchAuthentication.API_BASE}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                loginFormElement.reset();
                window.location.href = './index.html';
            }
            else {
                loginMessage.textContent = data.message || 'Error al iniciar sesión';
                loginMessage.className = 'alert alert-danger';
                loginMessage.classList.remove('d-none');
                setTimeout(() => loginMessage.classList.add('d-none'), 3000);
            }

        } catch (err) {
            loginMessage.textContent = err.message || 'Error al enviar la peticion.';
            loginMessage.className = 'alert alert-danger';
            loginMessage.classList.remove('d-none');
            setTimeout(() => loginMessage.classList.add('d-none'), 3000);
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

        const singupMessage = document.getElementById('singupMessage');
        const registerFormElement = document.getElementById('registerForm');

        try {
            const res = await fetch(`${FetchAuthentication.API_BASE}/auth/register`, {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (res.ok) {
                singupMessage.textContent = `${result.message}\n¡Registro exitoso! Ahora puedes iniciar sesión.`;
                singupMessage.className = 'alert alert-success';
                singupMessage.classList.remove('d-none');
                setTimeout(() => singupMessage.classList.add('d-none'), 3000);
                // Mostrar login y ocultar registro
                loginFormBox.style.display = 'block';
                registerFormBox.style.display = 'none';
                // Limpia el formulario
                registerFormElement.reset();
            }
            else {
                // Muestra el mensaje del servidor (como "usuario ya existe")
                singupMessage.textContent = `¡Registro fallido! ${result.message}`;
                singupMessage.className = 'alert alert-danger';
                singupMessage.classList.remove('d-none');
                setTimeout(() => singupMessage.classList.add('d-none'), 3000);
            }
        } catch (err) {
            singupMessage.textContent = `¡Registro fallido! ${err.message}`;
            singupMessage.className = 'alert alert-danger';
            singupMessage.classList.remove('d-none');
            setTimeout(() => singupMessage.classList.add('d-none'), 3000);
        }
    });
});
