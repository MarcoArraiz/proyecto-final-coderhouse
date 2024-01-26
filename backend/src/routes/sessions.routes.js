import { Router } from "express";
import passport from 'passport';
import { passportError, authorization } from "../utils/messagesError.js";
import { generateToken, authToken } from "../utils/jwt.js";


const sessionRouter = Router()

async function handleSuccessfulLogin(req, res, user) {
    req.session.passport.user = {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        rol: user.rol,
        welcome: true,
        cart: user.cart
    };

    const token = await generateToken(req.session.passport.user);

    res.cookie('jwtCookie', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 3600000
    });

    const userData = JSON.stringify(req.session.passport.user);
    res.cookie('userData', userData, {
        path: '/',
        httpOnly: false,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 3600000
    });

}


sessionRouter.post('/login', passport.authenticate('login',{failureRedirect: 'faillogin'}), async (req, res) => {
    try {
        if(!req.user){
            res.status(401).send({ resultado: 'Usuario invalido' });
        }
        await handleSuccessfulLogin(req, res, req.user);
        const token = await generateToken(req.session.passport.user);
        res.status(200).json({
            payload: req.session.passport,
            token: token,
            firstLogin: true
        });


    } catch (error) {
        console.error('Hubo un error al iniciar sesión:', error);
        res.status(500).send({ mensaje: `Error al iniciar sesion ${error}` });
    }
});

sessionRouter.get('/faillogin', (req, res) => {
    console.log('Error al iniciar sesión');
    res.status(401).json({ error: 'Credenciales inválidas.' });
});


sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), (req, res) => { 
    res.status(200).send({ resultado: 'Usuario creado exitosamente.' });
});

// Este es el callback de GitHub una vez que el usuario acepta o rechaza la autorización
sessionRouter.get('/githubCallback', 
    passport.authenticate('github', { failureRedirect: '/faillogin' }),
    async (req, res) => {
        try {
            await handleSuccessfulLogin(req, res, req.user);
            const token = await generateToken(req.session.passport.user);
            res.status(200).json({ token: token});
        } catch (error) {
            console.error('Hubo un error al iniciar sesión con GitHub:', error);
            res.status(500).send({ mensaje: `Error al iniciar sesion ${error}` });
        }
    }
);


sessionRouter.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al destruir la sesión:", err);
            res.status(500).send({ resultado: 'Error interno al desloguear' });
        } else {
            res.clearCookie('userData', {
                path: '/',
                httpOnly: false,
                secure: process.env.NODE_ENV !== 'development',
                maxAge: 3600000}) ; 
            // Limpiar la cookie 'jwt'
            res.clearCookie('jwtCookie', {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development'
            });
            res.status(200).send({ resultado: 'Usuario deslogueado' });
        }
    });
    req.logout(() => {
        console.log('Logged out');
    });// Método de Passport para cerrar sesión
});

//Verifica que el token enviado sea valido (misma contraseña de encriptacion)
sessionRouter.get('/testJWT', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send(req.user)
})

sessionRouter.get('/current', passportError('jwt'), authorization(['user','admin','premium']), (req, res) => {
    res.send(req.user)
})

sessionRouter.post('/update-welcome', (req, res) => {
    if (req.cookies && req.cookies.userData) {
        const userData = JSON.parse(decodeURIComponent(req.cookies.userData));
        userData.welcome = false;
        
        res.cookie('userData', JSON.stringify(userData), {
            path: '/',
            httpOnly: false,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 3600000
        });

        res.status(200).send({ result: 'Cookie updated successfully' });
    } else {
        res.status(400).send({ result: 'Cookie not found' });
    }
});


export default sessionRouter
