// PasswordReset.js
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const PasswordReset = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { token } = useParams();
    console.log('token', token);

    

    const resetPassword = async () => {
        if (newPassword !== confirmPassword) {
            setMessage('Las contraseñas no coinciden.');
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/api/users/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newPassword, token })
            })
            const responseData = await response.json(); // Convertir la respuesta a JSON
            console.log('responseData', responseData);
            if (response.ok) {
                setMessage(responseData.message);
                navigate('/login'); // Redirigir al login después del cambio exitoso
            } else {
                // Verificar si el error es debido a un token expirado
                if (responseData.message === 'Token expirado') {
                    Swal.fire({
                        title: 'Token Expirado',
                        text: 'Tu enlace de restablecimiento de contraseña ha expirado. Por favor, solicita un nuevo enlace.',
                        icon: 'warning',
                        confirmButtonText: 'Aceptar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate('/forgot-password'); // Redirige a la página de solicitud de restablecimiento
                        }
                    });
                } else {
                    // Manejar otros tipos de errores
                    setMessage(responseData.message);
                }
            }
        } catch (error) {
            setMessage(error.response.data.message);
        }
    };

    return (
        <div>
            <h2>Restablecer Contraseña</h2>
            <input
                type="password"
                placeholder="Nueva Contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="Confirmar Nueva Contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button onClick={resetPassword}>Restablecer Contraseña</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default PasswordReset;
