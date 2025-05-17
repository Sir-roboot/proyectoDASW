class FetchAuthentication {
    static ACCESS_TOKEN_NAME = 'accessToken';
    static REFRESH_TOKEN_NAME = 'refreshToken';
    static ROLE = 'role';
    static API_BASE = 'http://localhost:3000/CampingHouse';

    static async fetchAuth(urlPath, options = {}) {
        let token = localStorage.getItem(FetchAuthentication.ACCESS_TOKEN_NAME);
        let res;
        try {
            res = await fetch(urlPath, {
                ...options,
                headers: {
                    ...options.headers,
                    'Authorization': 'Bearer ' + token
                }
            });
        } catch (networkErr) {
            // Si ocurre un error de red (servidor caído, CORS, etc)
            throw new Error({message: "No se pudo conectar al servidor. Intenta más tarde."});
        }

        if(res.status === 401) {
            throw new Error("No has iniciado sesion. Por favor inicia sesion.");
        }

        //En caso de que el token de acceso expire se hace uan nueva peticon pero con el token de refresh
        if (res.status === 403) {
            const refreshRes = await fetch(`${FetchAuthentication.API_BASE}/user/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    refreshToken: localStorage.getItem(FetchAuthentication.REFRESH_TOKEN_NAME)
                })
            });

            //Si todo sale bien se hace de neuvo la peticion al servidor
            if (refreshRes.ok) {
                //Se actualiza la variable de token de acceso del ladro del front
                const data = await refreshRes.json();
                localStorage.setItem(FetchAuthentication.ACCESS_TOKEN_NAME, data.accessToken);
                //La petcion se hace de nuevo al servidor con los mismos parametros pero con el nuevo token de acceso
                return await fetch(urlPath, {
                    ...options,
                    headers: {
                        ...options.headers,
                        'Authorization': 'Bearer ' + data.accessToken
                    }
                });
            } else {
                alert("Sesión expirada");
                window.location.href = "./loginOrSingUpPage.html";
            }
        }

        return res;
    }

    static async fetchAuthSetParameters(urlPath, options = {}) {
        let res;
        try {
            res = await fetch(urlPath, { ...options });
        } catch (networkErr) {
            // Si ocurre un error de red (servidor caído, CORS, etc)
            throw new Error("No se pudo conectar al servidor. Intenta más tarde.");
        }

        let data;
        try {
            data = await res.json();
        } catch (jsonErr) {
            throw new Error("Respuesta inesperada del servidor.");
        }

        if (res.ok) {
            localStorage.setItem(FetchAuthentication.ACCESS_TOKEN_NAME, data.accessToken);
            localStorage.setItem(FetchAuthentication.REFRESH_TOKEN_NAME, data.refreshToken);
            localStorage.setItem(FetchAuthentication.ROLE, data.role);
            return data;
        } else {
            throw new Error(data.message || data.error || "Error en autenticación.");
        }
    }



    static async loadNavbar() {
        try {
            // Obtén el rol desde localStorage
            const role = localStorage.getItem(FetchAuthentication.ROLE);

            // Decide qué navbar cargar según el rol
            let navbarFile = './navbar_customer.html'; // Default (no logueado o genérico)
            if (role === 'admin') {
                navbarFile = './navbar_admin.html';
            } else if (role === 'customer') {
                navbarFile = './navbar_customer.html';
            }

            const resp = await fetch(navbarFile);
            const html = await resp.text();
            document.getElementById('navbar-placeholder').innerHTML = html;

            // Inyecta navbar.js después de cargar el HTML del navbar
            const script = document.createElement('script');
            script.src = '../ajaxAndfetch/navbar.js';
            script.onload = () => {
                console.log('navbar.js cargado y ejecutado correctamente');
            };
            document.body.appendChild(script);

        } catch (err) {
            console.error('Error al cargar el navbar:', err);
        }
    }
}

export default FetchAuthentication;