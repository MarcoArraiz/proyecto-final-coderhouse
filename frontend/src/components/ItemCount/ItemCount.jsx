import { useState } from 'react';
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";


const ItemCount = ({inicial, stock, funcionAgregar}) => {
    const [contador, setContador] = useState(inicial);

    const incrementar = () => {
        if(contador < (stock+5)) {
            setContador(contador +1);
        }
    }

    const decrementar = () =>{
        if (contador>inicial) {
            setContador(contador - 1 );
        }
    }
    return (
        <>
            <div>
                <Button variant="warning" onClick={decrementar}> -</Button>
                <p> {contador} </p>
                <Button variant="warning" onClick={incrementar}> +</Button>
            </div>
            {
            contador > 0 ?
            (<Button variant="warning" onClick={() => funcionAgregar(contador)}> Agregar al Carrito</Button>) : <></>
            }
        </>
    )
}

export default ItemCount




