import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import ItemCount from "../ItemCount/ItemCount";
import { useState, useContext } from "react";
import { CarritoContext } from "../../context/CarritoContext";

// eslint-disable-next-line react/prop-types
const ItemDetail = ({ id, nombre, precio, img, stock, descripcion }) => {
    const [agregarCantidad, setAgregarCantidad] = useState(0);

    const {agregarProducto} = useContext(CarritoContext);

    const manejadorCantidad = (cantidad) => {
        setAgregarCantidad(cantidad);
        console.log("Productos agregados: " + cantidad);
        const item = {id, nombre, precio};
        agregarProducto(item, cantidad);
    }
    return (
        <Card style={{ width: "25rem" }}>
            <Card.Img variant="top" src={img} alt={nombre} />
            <Card.Body >
                <Card.Title>{nombre}</Card.Title>
                <Card.Text>{precio}</Card.Text>
                <Card.Text>{descripcion}</Card.Text>
                <Card.Text>Stock:{stock}</Card.Text>
                <ItemCount inicial={0} stock={stock} funcionAgregar={manejadorCantidad}/>
            {
                
                agregarCantidad > 0 ? (<Link to="/cart"> <Button variant="warning"> Terminar Compra</Button></Link>) : <></>
            }

            </Card.Body>
        </Card>
    );
};

export default ItemDetail;
