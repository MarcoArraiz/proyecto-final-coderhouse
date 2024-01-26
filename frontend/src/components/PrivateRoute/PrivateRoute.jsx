
import { Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = ({ component: Component, roles = ['user','premium'] }) => {
  const { isLoggedIn, userRole, isLoading } = useContext(AuthContext);
  const location = useLocation();

  if (isLoading) {
    return <div>Cargando...</div>; // Podrías reemplazar esto con un componente de carga real
  }

  if (!isLoggedIn) {
    // No está autenticado, así que redirige a la página de inicio de sesión
    // 'replace' es para evitar que el usuario vuelva a la ruta protegida después de iniciar sesión.
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!roles.includes(userRole)) {
    // El usuario no tiene el rol requerido, así que redirige a una página de error o inicio
    // Aquí podrías querer tener una ruta dedicada para "Acceso Denegado"
    return <Navigate to="/unauthorized" replace />;
  }

  // Usuario autenticado y con el rol correcto, renderiza el componente
  return <Component />;
};

export default PrivateRoute;
