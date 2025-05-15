// Función para resaltar la opción activa en el navbar según la URL
function highlightActiveLink() {
    const links = document.querySelectorAll('#optionsBar .nav-link');
    const currentPath = window.location.pathname.split('/').pop();
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('active');
        }
    });
}
  
// Función para manejar logout
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    console.log(document)
    console.log(logoutBtn)
    if (logoutBtn) {
        console.log("hola 2")
        logoutBtn.addEventListener('click', () => {
            // Eliminar token de auth
            localStorage.removeItem('authToken');
            // Redirigir a página de login o home
            console.log("hola 3");
            window.location.href = './loginOrSingUpPage.html';
            console.log(window.location.href)
        });
    }
    console.log("no entre")
}

setupLogout();
highlightActiveLink();

  