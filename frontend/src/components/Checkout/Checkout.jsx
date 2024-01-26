import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const Checkout = () => {
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const [orderId, setOrderId] = useState('');
    const [validated, setValidated] = useState(false);
    const [formularioEnviado, setFormularioEnviado] = useState(false);
    const [dataCarrito, setDataCarrito] = useState({ cart: { products: [] } });
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const obtenerCarrito = async () => {
            try {
                console.log('Obteniendo carrito...');
                const token = Cookies.get('jwtCookie');
                const cart_id = jwtDecode(token).user.cart;
                console.log('cart_id', cart_id);
                const respuesta = await fetch(`http://localhost:4000/api/carts/${cart_id}`);
                const datos = await respuesta.json();
                console.log('datos', datos);
                setDataCarrito(datos.payload);
                console.log('Carrito obtenido con éxito:', datos.payload);
            } catch (error) {
                console.error('Hubo un error al obtener el carrito:', error);
            }
        };

        obtenerCarrito();
    }, []);


        useEffect(() => {
            const obtenerCarrito = async () => {
                try {
                    console.log('Obteniendo carrito...');
                    const token = Cookies.get('jwtCookie');
                    const cart_id = jwtDecode(token).user.cart;
                    console.log('cart_id', cart_id);
                    const respuesta = await fetch(`http://localhost:4000/api/carts/${cart_id}`);
                    const datos = await respuesta.json();
                    console.log('datos', datos);
                    setDataCarrito(datos.payload);
                    console.log('Carrito obtenido con éxito:', datos.payload);
                } catch (error) {
                    console.error('Hubo un error al obtener el carrito:', error);
                }
            };

            obtenerCarrito();
        }, []);

        const handleSubmit = async (event) => {
            const form = event.currentTarget;
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }

            setValidated(true);
            event.preventDefault();
            setError('');

            if (address && termsAccepted) {
                const token = Cookies.get('jwtCookie');
                const user_id = jwtDecode(token).user._id;
                const cart_id = jwtDecode(token).user.cart;
                const order = {
                    totalAmount: dataCarrito.totalAmount,
                    totalQuantity: dataCarrito.totalQuantity,
                    address: address,
                    user_id: user_id,
                    products: dataCarrito.cart.products.map((prod) => ({
                        price: prod.id_prod.price,
                        quantity: prod.quantity,
                        title: prod.id_prod.title,
                        code: prod.id_prod.code,
                        id: prod.id_prod._id,
                    })),
                };

                try {
                    setIsLoading(true); // Mostrar animación de espera
                    const response = await fetch(`http://localhost:4000/api/orders/${cart_id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify(order),
                    });
                    if (!response.ok) {
                        throw new Error('Hubo un error al crear la orden');
                    } else {
                        const data = await response.json();
                        console.log('data', data);
                        setOrderId(data.payload._id);
                        setFormularioEnviado(true);
                    }
                } catch (error) {
                    console.error('Hubo un error al crear la orden:', error);
                    setError('Hubo un error al crear la orden');
                } finally {
                    setIsLoading(false); // Ocultar animación de espera
                }
            }
        };


    return (
        <>
            <div className="mx-5">
                {dataCarrito.cart.products.map((prod) => (
                    <p key={prod.id_prod._id}>
                        Producto: {prod.id_prod.title} - Precio {prod.id_prod.price} - Cant: {prod.quantity}
                    </p>
                ))}
                <p> Cantidad Total: {dataCarrito.totalQuantity} </p>
                <p> Monto Total: {dataCarrito.totalAmount} </p>
            </div>
            <h2>Checkout</h2>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Form.Group as={Col} md="6" controlId="validationCustom01">
                        <Form.Label>Direccion </Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Direccion"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            disabled={formularioEnviado}
                        />
                        <Form.Control.Feedback>¡Perfecto!</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Form.Group className="mb-3">
                    <Form.Check 
                        required 
                        label="Acepte los terminos y condiciones" 
                        feedback="debe aceptar los terminos y condiciones" 
                        feedbackType="invalid" 
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                    />
                </Form.Group>
                <Button type="submit" disabled={formularioEnviado || !termsAccepted}>
                    Hacer pedido
                </Button>
            </Form>

            {isLoading && <p>Realizando pedido...</p>} {/* Mostrar animación de espera si isLoading es true */}

            {error && <p style={{ color: 'red' }}> {error} </p>}

            {orderId && <strong>¡Gracias por tu compra! Tu número de orden es {orderId} </strong>}
        </>
    );
};


export default Checkout;
