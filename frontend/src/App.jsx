import NavBar from './components/NavBar/NavBar';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import ItemDetailContainer from './components/ItemDetailContainer/ItemDetailContainer';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
// import { CarritoProvider } from './context/CarritoContext';
// import Formulario from './components/Formulario/Formulario';
import Cart from './components/Cart/Cart';
import Checkout from './components/Checkout/Checkout';
import SignupForm from './components/SignupForm/SignupForm';
import Login from './components/Login/Login';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import Category from './components/Category/Category';
import PasswordReset from './components/PasswordReset/PasswordReset';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import Profile from './components/Profile/Profile';
import UsersDashboard from './components/UsersDashboard/UsersDashboard';

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
  integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"

/>

function App() {

  return (
    <>
      <AuthProvider>
        <BrowserRouter> 
            <NavBar/>
              <Routes>
                <Route path="/" element={<PrivateRoute component={Home} />} />
                <Route path="/categoria/:idCategoria" element={<PrivateRoute component={Category}/>}/>
                <Route path='/checkout' element={<PrivateRoute component={Checkout}/>}/>
                <Route path='/cart' element={<PrivateRoute component={Cart}/>} />
                <Route path="/password-reset/:token" element={<PasswordReset/>} />
                <Route path='/forgot-password' element={<ForgotPassword/>}/>
                <Route path="/signup" element={<SignupForm/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/profile" element={<PrivateRoute component={Profile}/>}/>
                <Route path="/admin/users" element={<PrivateRoute component={UsersDashboard}/>}/>
                <Route path="*" element={<h2>Seccion en construccion</h2>}/>
              </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App;
