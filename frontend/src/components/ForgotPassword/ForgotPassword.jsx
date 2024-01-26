// ForgotPassword.jsx
import { useState } from 'react';
import Swal from 'sweetalert2';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            // Llamada asincrónica a la API
            fetch('http://localhost:4000/api/users/request-reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email }) // Cambia esto para enviar un objeto
            })
            .then(response => {
                if (response.ok) {
                    // Mostrar alerta de éxito
                    Swal.fire({
                        title: '¡Revisa tu correo!',
                        text: 'Si el correo existe en nuestra base de datos, te enviaremos un enlace para restablecer tu contraseña.',
                        icon: 'success',
                        confirmButtonText: 'Entendido'
                    });
                } else {
                    // Mostrar alerta de error si la respuesta no es exitosa
                    throw new Error('Error en la solicitud');
                }
            })
        } catch (error) {
            // Manejar errores en la llamada a la API
            console.error('Error en la solicitud:', error); // Opcional: registrar el error en la consola
    
            // Mostrar alerta de error
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al enviar tu solicitud. Por favor, inténtalo de nuevo más tarde.',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
        } finally {
            // Desactivar el estado de carga al finalizar la solicitud
            setIsLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <form onSubmit={handleSubmit}>
                <h2>Restablecer contraseña</h2>
                <div className="form-group">
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? 'Enviando...' : 'Enviar solicitud'}
                </button>
            </form>
        </div>
    );
}

export default ForgotPassword;
