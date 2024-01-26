// Selecciona el formulario usando el ID
const form = document.getElementById('signupForm');

// Añade un Event Listener para el evento "submit" del formulario
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que el formulario se envíe de la manera tradicional

    // Recoge los valores del formulario
    const formData = {
        first_name: e.target.first_name.value,
        last_name: e.target.last_name.value,
        age: parseInt(e.target.age.value),
        email: e.target.email.value,
        password: e.target.password.value
    };

    try {
        // Haz una solicitud POST usando fetch
        const response = await fetch('/api/users/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        // Procesa la respuesta. Puedes mostrar un mensaje al usuario, redirigir, etc.
        if (response.ok) {
            try {
                Swal.fire({
                    title: '¡Registro exitoso!',
                    text: 'Serás redirigido a la página de inicio de sesión.',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/login'; // Redirecciona al usuario a la vista "login"
                    }
                });
            } catch (error) {
                // Manejar el error, quizá quieras mostrar otro Swal aquí
                Swal.fire({
                    title: 'Error',
                    text: 'Ha ocurrido un error durante el registro.',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            }
            // window.location.href = '/rutaDondeQuieresRedirigir'; 
        } else {
            alert(`Error: ${data.mensaje}`);
        }
    } catch (error) {
        console.error('Hubo un error al registrar el usuario:', error);
        alert('Hubo un error al registrar. Inténtalo nuevamente.');
    }


});
