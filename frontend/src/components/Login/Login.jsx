import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';


function Login() {
    const [email, setEmail] = useState('ejemplo@ejemplo.com');
    const [password, setPassword] = useState('123456');
    const { isLoggedIn, login } = useContext(AuthContext);
    const [loginAttempted, setLoginAttempted] = useState(false);
    const navigate = useNavigate();
    const [isCookieValid, setIsCookieValid] = useState(false);
    const [isLoading, setIsLoading] = useState(true);



    useEffect(() => {
        console.log('isLoggedIn useffectlogin', isLoggedIn);
        if (isLoggedIn) {
            setIsLoading(true);
            try {
                const jwtCookie = Cookies.get('jwtCookie');
                if (jwtCookie) {
                    const decodedToken = jwtDecode(jwtCookie);
                    if (decodedToken.exp * 1000 > Date.now()) {
                        setIsCookieValid(true);
                    } else {
                        setIsCookieValid(false);
                        Cookies.remove('jwtCookie');
                    }
                } else {
                    setIsCookieValid(false);
                }
            } catch (error) {
                console.error("Error decodificando el token:", error);
                setIsCookieValid(false);
            }
            setIsLoading(false);
            if (isCookieValid) {
                navigate('/');
            }
        }
    }, [isLoggedIn, navigate, loginAttempted, isCookieValid]);

    // Efecto que se ejecuta una sola vez al montar el componente
    useEffect(() => {
        // Función que maneja el inicio de sesión
        const attemptLogin = async () => {
            setLoginAttempted(false); // Resetea antes de intentar
            await login(); // Intenta iniciar sesión
            setLoginAttempted(true); // Indica que se ha intentado iniciar sesión
        };
        attemptLogin();
    }, [login])

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/api/sessions/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            console.log('Data', data);
            // Configuramos la cookie aquí
            document.cookie = `jwtCookie=${data.token}; path=/; expires=${new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toUTCString()}`;
            // Llamamos a la función login del contexto para actualizar el estado global de autenticación
            await login(); // Asegúrate de obtener esta función del contexto utilizando useContext
        } catch (error) {
            console.error(error);
            // handle login error
        }
    };


    const handleGithubLogin = () => {
        fetch('http://localhost:4000/api/sessions/github')
            .then(response => response.json())
            .then(data => {
                console.log('Ddata', data)
                document.cookie = `jwtCookie=${data.token}; path=/; expires=${new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toUTCString()}`
                navigate('/')
                // handle successful login
            })
            .catch(error => console.error(error));
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2 className="mb-4">Iniciar sesión</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label htmlFor="email">Correo electrónico</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                aria-describedby="emailHelp"
                                placeholder="Ingresa tu correo electrónico"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                            <small id="emailHelp" className="form-text text-muted">
                                Nunca compartiremos tu correo electrónico con nadie más.
                            </small>
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="password">Contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Ingresa tu contraseña"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg btn-block">
                            Iniciar sesión
                        </button>
                        <button onClick={handleGithubLogin} className="btn btn-secondary btn-lg btn-block">
                            Iniciar sesión con GitHub
                        </button>
                        <div className="mt-4">
                            <span>¿Aún no tenés una cuenta? </span>
                            <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => navigate('/signup')}>Registrate acá</span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;