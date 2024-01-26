import {useEffect, useState, useContext} from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';
import { AuthContext } from '../../context/AuthContext';

const Cart = () => {
    const [dataCarrito, setDataCarrito] = useState({ cart: { products: [] } });
    const { setTotalQuantity, totalQuantity } = useContext(AuthContext); 
    // Función para obtener el carrito de la API
    const obtenerCarrito = async () => {
        try {
            console.log("Obteniendo carrito...")
            const token = Cookies.get('jwtCookie');
            const cart_id = jwtDecode(token).user.cart;
            console.log("cart_id", cart_id);
            const respuesta = await fetch(`http://localhost:4000/api/carts/${cart_id}`);
            const datos = await respuesta.json();
            console.log("datos", datos);
            setDataCarrito(datos.payload);
            setTotalQuantity(datos.payload.totalQuantity)
            console.log("Carrito obtenido con éxito:", datos.payload);
        } catch (error) {
            console.error("Hubo un error al obtener el carrito:", error);
        }
    };

    const eliminarProducto = async (id) => {
        try {
            console.log("Eliminando producto...")
            const token = Cookies.get('jwtCookie');
            const cart_id = jwtDecode(token).user.cart;
            console.log("cart_id", cart_id);
            const respuesta = await fetch(`http://localhost:4000/api/carts/${cart_id}/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log("respuesta", respuesta.status == 200);
            if (respuesta.status == 200) { // Asegúrate de verificar que la respuesta fue exitosa
                console.log("respuesta", respuesta);
                obtenerCarrito(); // Llamamos a obtenerCarrito() para actualizar el estado.
            }
        } catch (error) {
            console.error("Hubo un error al eliminar el producto:", error);
        }
    }

    useEffect(() => {
        obtenerCarrito();
    }, []);

    const vaciarCarrito = async () => {
        try {
            console.log("Vaciar carrito...")
            const token = Cookies.get('jwtCookie');
            const cart_id = jwtDecode(token).user.cart;
            const respuesta = await fetch(`http://localhost:4000/api/carts/${cart_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (respuesta.ok) { // Asegúrate de verificar que la respuesta fue exitosa
                obtenerCarrito(); // Llamamos a obtenerCarrito() para actualizar el estado.
            }
        } catch (error) {
            console.error("Hubo un error al vaciar el carrito:", error);
        }
    };
            
    if ( dataCarrito.totalQuantity == 0 ) {
        return (    
            <>
                <h1> Tu carrito está vacío </h1>
                <Link to="/"> Ver productos</Link>
            </>
        )
    } else {
        return (
            <div>
            {dataCarrito.cart.products.map(prod => (
                <Card className="col-12" style={{ width: "14rem" }} key={prod.id_prod._id}>
                    <Card.Body id={prod.id_prod._id}>
                        <Card.Title>Nombre: {prod.id_prod.title}</Card.Title>
                        <Card.Text>Precio: ${prod.id_prod.price} </Card.Text>
                        <Card.Text>Cantidad: {prod.quantity} </Card.Text>
                        <Card.Link onClick={() => eliminarProducto(prod.id_prod._id)}>Eliminar</Card.Link>
                    </Card.Body>
                </Card>

            ))}
            <Link to="/"> Ver más productos</Link>
            <br></br>
            <Card.Link onClick={() => vaciarCarrito()}>Vaciar Carrito</Card.Link>
            <h3> Total a pagar: ${dataCarrito.totalAmount}</h3>
            <Link to="/checkout"> Finalizar compra</Link>
        </div>
        )
    }
}

export default Cart
