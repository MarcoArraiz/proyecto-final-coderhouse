import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import {useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom';
import "./ItemCard.css"
import axios from 'axios';
import Cookies from 'js-cookie';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { AuthContext } from '../../context/AuthContext';

import ItemCount from "../ItemCount/ItemCount";


// eslint-disable-next-line react/prop-types
const ItemCard = ({_id,title,price,thumbnail,stock}) => {
    const [agregarCantidad, setAgregarCantidad] = useState(0);
    const [showToast, setShowToast] = useState(false);
    const { setTotalQuantity  } = useContext(AuthContext);
    useEffect(() => {
        console.log("Productos agregados: " + agregarCantidad);
    }, [agregarCantidad]);

    const manejadorCantidad = async (cantidad) => {
        setAgregarCantidad(cantidad);
        const token = Cookies.get('jwtCookie');
        const cart = JSON.parse(atob(token.split('.')[1]));
        const cart_id = cart.user.cart;

        let apiUrl = 'http://localhost:4000/api/carts/';
        apiUrl +=`${cart_id}/products/`;
        apiUrl += `${_id}`;
        try {
            const res = await axios.put(
                apiUrl,
                { "quantity": cantidad }, // Esto es el cuerpo (body) de la petición
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            if (res.status === 200) {
                setTotalQuantity(res.data.payload.totalQuantity);
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            }
        } catch (error) {
            console.error("Error al realizar la petición:", error);
        }
    }


    return (
        <>  
            {/* ToastContainer para manejar la posición de las toasts */}
            <ToastContainer className="p-3" position="bottom-end">
                {/* Toast que se muestra cuando se agrega un producto */}
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">Carrito de Compras</strong>
                    </Toast.Header>
                    <Toast.Body>¡Producto agregado al carrito con éxito!</Toast.Body>
                </Toast>
            </ToastContainer>
            <Card className="col-4" style={{ width: "14rem" }}>
                <Card.Img variant="top" src={thumbnail} alt={title} />
                <Card.Body _id={_id}>
                    <Card.Title>{title}</Card.Title>
                    <Card.Text> {price} </Card.Text>
                    <ItemCount inicial={0} stock={stock} funcionAgregar={manejadorCantidad}/>
                    <div className="row d-flex justify-content-center pt-2">
                        <Button className='align-self-center col-6' variant="warning">
                        <Link className="button_text" to={`/item/${_id}`}>Ver más</Link>
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </>
    );
};

export default ItemCard;
