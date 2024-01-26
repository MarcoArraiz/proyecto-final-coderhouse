import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import CartWidget from "../CartWidget/CartWidget";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

const NavBar = () => {
    const navigate = useNavigate();
    const { isLoggedIn, logout } = useContext(AuthContext);
    const handleLogout = async () => {
        try {
            document.cookie = "jwtCookie=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";

            const token = Cookies.get('jwtCookie');
            if (!token) {
                console.log('Logout exitoso');
                logout();
                navigate('/login'); // Navegar al login
            }
            const res = await axios.get('http://localhost:4000/api/sessions/logout', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.status === 200) {
                // Aquí puedes realizar más acciones como redirigir al usuario o actualizar el estado global
                console.log('Logout exitoso');
            }
            navigate('/login');  // Redirigir al usuario a la página de inicio de sesión
        } catch (error) {
            console.error('Error al hacer logout:', error);
        }
    };

    return (
        <div>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Link to="/">
                        <Navbar.Brand>
                            {' '}MaruStore
                        </Navbar.Brand>
                    </Link>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <NavLink className="nav-link" to={`/categoria/GPU`}>GPU</NavLink>
                            <NavLink className="nav-link" to={`/categoria/Procesadores`}>Procesadores</NavLink>
                            <NavLink className="nav-link" to={`/categoria/Perifericos`}>Perifericos</NavLink>
                            <NavDropdown
                                title="Mi Perfil"
                                id="basic-nav-dropdown"
                            >
                                <NavDropdown.Item href="#action/3.1">
                                    Mis Datos
                                </NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">
                                    Mis pedidos
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                {
                                    isLoggedIn ? (
                                        <NavDropdown.Item onClick={handleLogout}>
                                            Log out
                                        </NavDropdown.Item>) : (
                                        <NavDropdown.Item href="/login">
                                            Log in
                                        </NavDropdown.Item>)
                                }
                            </NavDropdown>
                            <CartWidget />
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
};

export default NavBar;