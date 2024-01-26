import { useEffect, useState } from 'react'
import ItemDetail from '../ItemDetail/ItemDetail';
import { useParams } from 'react-router-dom';
import { getDoc, doc} from 'firebase/firestore';
import { db } from '../../services/config';

const ItemDetailContainer = () => {
    const [producto, setProducto] = useState(null);
    const [noExiste, setNoExiste] = useState(false)
    const {idItem} = useParams();

    useEffect(() => {
        setNoExiste(false);
        const nuevoDoc = doc(db, "products", idItem);
        getDoc(nuevoDoc)
            .then(res => {
                if(res.exists()){
                const data = res.data();
                const nuevoProducto = {id:res.id, ...data};
                setProducto(nuevoProducto);
                } else { 
                    setNoExiste(true)
                }
            })
            .catch(error => console.log(error));
    
        },[idItem]);
    if(!noExiste){
    return (
            <div >
                <div className='d-flex justify-content-center'>
                {producto?.id &&<ItemDetail key={producto.id} {...producto} />}
                </div>
            </div>
        )
    } else {
        return (
            <>
                <h2>PRODUCTO NO DISPONIBLE</h2>
            </>
        )
    }
}

export default ItemDetailContainer
