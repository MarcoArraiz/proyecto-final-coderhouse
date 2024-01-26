import './CartWidget.css';
import ItemCounter from '../ItemCounter/ItemCounter'
import { Link } from 'react-router-dom';

const CartWidget = () => {
    return (
        <>
        <Link to="/cart">
        <img src='https://cdn-icons-png.flaticon.com/512/3081/3081986.png'></img>
        </Link>
        <ItemCounter/>

        </>
    )
}

export default CartWidget
