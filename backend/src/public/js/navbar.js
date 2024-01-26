document.addEventListener('DOMContentLoaded', () => {
    const authButton = document.getElementById('authButton');
    const navbarNav = document.querySelector('.navbar-nav');

    const userDataCookie = getCookie('userData');

    if (userDataCookie) {
        const userData = JSON.parse(decodeURIComponent(userDataCookie)); // decodificamos y eliminamos el 'j:'
        authButton.textContent = 'Signout';
        const greeting = document.querySelector('#greeting');
        //const greeting = document.createElement('span');
        greeting.textContent = 'Hola, ' + userData.first_name;
        greeting.style.marginRight = '10px'; // añadir un poco de espacio entre el mensaje y el botón
        //navbarNav.insertBefore(greeting, authButton);
    } else {
        authButton.textContent = 'Login';
    }

    authButton.addEventListener('click', () => {
        if (authButton.textContent === 'Signout') {
            window.location.href = "/logout";
        } else {
            window.location.href = "/login";
        }
    });
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
