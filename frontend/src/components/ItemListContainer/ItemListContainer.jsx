import { useState, useEffect} from 'react';
import ItemList from '../ItemList/ItemList';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';


const ItemListContainer = () => {
    const [productos, setProductos] = useState([]);
    const {idCategoria} = useParams();
    const navigate = useNavigate(); // Inicializar useHistory
 
    useEffect( () => {
         // Definir la URL de la API. Ajusta esto según sea necesario
        let apiUrl = 'http://localhost:4000/api/products';
        
        // Añadir parámetros de categoría si existen
        if (idCategoria) {
            apiUrl += `?category=${idCategoria}`;
        }
        const token = Cookies.get('jwtCookie');
        if(!token){
            navigate('/login');
        }
            // Realizar la petición a la API
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // reemplazar con el token JWT real
        }
      })
      .then(response => {
        if (response.status === 401) {
          // Redirigir al usuario a la página de inicio de sesión
          window.location.href = '/login';
        }
        return response.json();
      })
      .then(data => {
        setProductos(data.payload);
      })
      .catch((error) => console.log("el error es", error));


        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[idCategoria])
    return (
        <div className = "mx-5">
            <ItemList productos= {productos} className="container-fluid d-flex" />
        </div>
    )
}

export default ItemListContainer
