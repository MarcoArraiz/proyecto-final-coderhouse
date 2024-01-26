import './ItemCounter.css';
import { useContext } from "react";
import { AuthContext } from '../../context/AuthContext';


const ItemCounter = () => {
    const { totalQuantity } = useContext(AuthContext);

    return (
        <div id="cart-icon">
            <span id="cart-count">{totalQuantity}</span>
        </div>
    );
};

export default ItemCounter;
