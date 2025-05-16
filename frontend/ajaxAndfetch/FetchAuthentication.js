class FetchAuthentication {
    static ACCESS_TOKEN_NAME = 'accessToken';
    static REFRESH_TOKEN_NAME = 'refreshToken';

    static async fetchAuth(urlPath, options = {}) {
        let token = localStorage.getItem(FetchAuthentication.ACCESS_TOKEN_NAME);

        let res = await fetch(urlPath, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': 'Bearer ' + token
            }
        });

        //En caso de que el token de acceso expire se hace uan nueva peticon pero con el token de refresh
        if (res.status === 401) {
            const refreshRes = await fetch('http://localhost:3000/CampingHouse/user/auth/refresh', {
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

    static async fetchSetParms(urlPath, options = {}) {
        
        const res = await fetch(urlPath,{
            ...options
        }) 

        const data = await res.json();

        if(!data.existUser) {
            localStorage.setItem(FetchAuthentication.ACCESS_TOKEN_NAME, data.accessToken);
            localStorage.setItem(FetchAuthentication.REFRESH_TOKEN_NAME, data.refreshToken);
        }

        return res;
    }
}

export default FetchAuthentication;