import { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';  // Importar SweetAlert2
import { useNavigate } from 'react-router-dom'; // Para redireccionar

function SignupForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState('');
    const [first_name, setfirst_name] = useState('');
    const [last_name, setlast_name] = useState('');
    const navigate = useNavigate();  // Hook de React Router para la navegación

    const handleSubmit = (event) => {
        event.preventDefault();
        //Validaciones de campos
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            Swal.fire('Error', 'Por favor, introduce un email válido', 'error');
            return;
        }
        if (!password || password.length < 6) {
            Swal.fire('Error', 'La contraseña debe tener al menos 6 caracteres', 'error');
            return;
        }
        if (!age || age < 18 || age > 100) {
            Swal.fire('Error', 'La edad debe ser un número entre 18 y 100', 'error');
            return;
        }
        if (!first_name || !last_name) {
            Swal.fire('Error', 'El nombre y apellido no pueden estar vacíos', 'error');
            return;
        }
        const data = { email, password, age, first_name, last_name };
        fetch('http://localhost:4000/api/users/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                return response.json().then(data => {
                    throw new Error(data.mensaje || "Error desconocido");
            });
        }
    })
        .then(data => {
            // Solicitar código de verificación
            Swal.fire({
                title: 'Verifica tu Email',
                input: 'text',
                inputLabel: 'Ingrese el código de verificación enviado a su email',
                showCancelButton: true,
                confirmButtonText: 'Verificar',
                cancelButtonText: 'Cancelar',
            }).then((result) => {
                if (result.isConfirmed) {
                    verifyCode(result.value); // Función para verificar el código
                }
            });
        })
        .catch(error => {
            // Mostrar alerta de error
            Swal.fire(
                'Error de registro',
                `Ocurrió un error durante el registro: ${error.message}`,
                'error'
            );
        });
    };

    /// FUNCION PARA LA VERIFICACION DEL CODIGO DE EMAIL
    const verifyCode = (code) => {
        fetch('http://localhost:4000/api/users/verify-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, verificationCode: code })
        })
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                return response.json().then(data => {
                    throw new Error(data.mensaje || "Error desconocido al verificar el código");
                });
            }
        })
        .then(data => {
            Swal.fire(
                'Verificación exitosa',
                'Su email ha sido verificado exitosamente.',
                'success'
            ).then(() => {
                navigate('/login');
            });
        })
        .catch(error => {
            Swal.fire(
                'Error en la verificación',
                error.message,
                'error'
            );
        });
    };
    


    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                                type="email" 
                                value={email} 
                                onChange={e => setEmail(e.target.value)} 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Age</Form.Label>
                            <Form.Control 
                                type="number" 
                                value={age} 
                                onChange={e => setAge(e.target.value)} 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={first_name} 
                                onChange={e => setfirst_name(e.target.value)} 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={last_name} 
                                onChange={e => setlast_name(e.target.value)} 
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Register
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default SignupForm;
