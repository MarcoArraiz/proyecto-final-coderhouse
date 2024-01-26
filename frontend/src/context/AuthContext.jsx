import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
export const AuthContext = createContext(null);
import Cookies from 'js-cookie';

// Ignoro la siguiente linea con eslint
// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalQuantity , setTotalQuantity] = useState(0);

  const login = () => {
    setIsLoading(true);
    try {
      const jwtCookie = Cookies.get('jwtCookie');
      if (jwtCookie) {
        const decodedToken = jwtDecode(jwtCookie);
        if (decodedToken.exp * 1000 > Date.now()) {
          setIsLoggedIn(true);
          setUserRole(decodedToken?.user?.rol);
        } else {
          setIsLoggedIn(false);
          Cookies.remove('jwtCookie');
        }
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Error decodificando el token:", error);
      setIsLoggedIn(false);
    }
    setIsLoading(false);
  };
  

  // Aquí iría la lógica para verificar si el usuario está autenticado, por ejemplo, al cargar la aplicación.
  // También deberías determinar el rol del usuario aquí.
  useEffect(() => {
    // Esto se activará cada vez que se cargue o actualice el componente
    login();
  }, []);

  const logout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    Cookies.remove('jwtCookie'); // Asegúrate de borrar la cookie de JWT al cerrar sesión
  };


  const contextValue = {
    isLoggedIn,
    isLoading, // añadido al valor del contexto
    userRole,
    logout,
    login,
    setTotalQuantity,
    totalQuantity
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
