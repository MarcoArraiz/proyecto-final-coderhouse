
window.onload = async function() {
    try {
        await fetch('/api/sessions/logout', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        window.location.href = "/login";
} catch (error) {
        console.error(error);
        Swal.fire({ icon: 'error', title: 'Oops...', text: 'Hubo un error al intentar cerrar sesión' });
}
}


