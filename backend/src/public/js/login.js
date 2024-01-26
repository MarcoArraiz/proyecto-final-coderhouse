// Esta limpieza de cookie es una alernativa para cuando la session se destruye por vencimiento sin pasar por logout
//document.cookie = 'userData' + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
// esta funcion se ejecuta con el evento submit del formulario
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;


    try {
        const response = await fetch('/api/sessions/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (response.status === 200) {
            window.location.href = data.redirectTo;
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data.resultado
            });
        }

    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Hubo un error al intentar iniciar sesión'
        });
    }
});
