import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const UpgradeToPremium = () => {
    const [showModal, setShowModal] = useState(false);
    const [file, setFile] = useState(null);
    const [additionalFile, setAdditionalFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const token = Cookies.get('jwtCookie');
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserInfo(decodedToken.user);
        }
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleAdditionalFileChange = (e) => {
        setAdditionalFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('document', file);
        if (additionalFile) {
            formData.append('additionalDocument', additionalFile);
        }

        const token = Cookies.get('jwtCookie');
        const uid = jwtDecode(token).user._id;

        try {
            const response = await fetch(`http://localhost:4000/api/users/${uid}/documents`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Error al subir los documentos');
            }

            setShowModal(true);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpgrade = async () => {
        const token = Cookies.get('jwtCookie');
        const uid = jwtDecode(token).user._id;

        try {
            const response = await fetch(`http://localhost:4000/api/users/premium/${uid}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error al solicitar la cuenta premium');
            }

            alert('Solicitud de cuenta premium realizada con éxito');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div style={{ padding: '20px', margin: '20px' }}>
            {userInfo && (
                <div className="user-profile" style={{ marginBottom: '20px' }}>
                    <h3>Perfil del Usuario</h3>
                    <p>Nombre: {userInfo.first_name} {userInfo.last_name}</p>
                    <p>Email: {userInfo.email}</p>
                    <p>Edad: {userInfo.age}</p>
                    <p>Rol: {userInfo.rol}</p>
                </div>
            )}

            <Form onSubmit={handleSubmit} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '5px' }}>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Documento principal</Form.Label>
                    <Form.Control type="file" onChange={handleFileChange} required />
                </Form.Group>
                <Form.Group controlId="formFileAdditional" className="mb-3">
                    <Form.Label>Documento adicional (opcional)</Form.Label>
                    <Form.Control type="file" onChange={handleAdditionalFileChange} />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={isSubmitting|| !file}>
                    Enviar documentos
                </Button>
            </Form>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmación</Modal.Title>
                </Modal.Header>
                <Modal.Body>Documentos subidos con éxito. ¿Deseas solicitar la cuenta premium ahora?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleUpgrade}>
                        Solicitar cuenta premium
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
export default UpgradeToPremium;
