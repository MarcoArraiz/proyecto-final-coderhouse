import passport from "passport";

//Funcion general para retornar errores es las estrategias de passport

export const passportError = (strategy) => { //Voy a enviar local, github o jwt
    return async (req, res, next) => {
        passport.authenticate(strategy, (error, user, info) => {
            if (error) {
                console.error('Authentication error:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
            if (!user) {
                console.log('Authentication failed:', info);
                // En lugar de redirigir, devolvemos un error de estado 401 Unauthorized
                return res.status(401).json({ error: 'Authentication failed', details: info });

            }
            req.user = user
            next()
        })(req, res, next) //Esto es por que me va a llamar un middleware

    }
}

//Recibo un rol y establezco la capacidad del usuario
export const authorization = (rol) => { //rol = 'Admin' desde ruta 'Crear Producto'
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).send({ error: 'User no autorizado' })
        }
        if (!rol.includes(req.user.user.rol)) { 
            return res.status(403).send({ error: 'Usuario no tiene los permisos necesarios' })
        }
        next()
    }
}