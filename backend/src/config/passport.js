import local from 'passport-local';
import passport from 'passport';
import GithubStrategy from 'passport-github2';
import { hashPassword, validatePassword } from '../utils/bcrypt.js';
import { userModel } from '../dao/models/user.models.js';
import CustomError from '../services/errors/CustomError.js';
import EError from '../services/errors/enum.js';
import { generateUserError } from '../services/errors/info.js';
import jwt from 'passport-jwt';
import dotenv from 'dotenv';



//Definir la estrategia local
const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt //Extrar de las cookies el token
//funciones auxiliares
const findUserByEmail = async (email) => {
    console.log('email', email);
    return await userModel.findOne({ email: email });
};

const InitializePassport = () => {

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    }, async (jwt_payload, done) => { //jwt_payload = info del token (en este caso, datos del cliente)
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }

    }))

    // Definir la estrategia local
    passport.use('signup', new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
            // Buscar el usuario en la BD
            const user = await findUserByEmail(email);
            // Si el usuario ya existe
            if (user) {
                throw CustomError.createGenericError('El usuario ya existe', 'User already exists');
            }
            // Validar campos obligatorios
            if (!first_name || !last_name || !email || !password || !age) {
                throw CustomError.createError({
                    name: "User creation error",
                    cause: generateUserError({ first_name, last_name, email, password, age }),
                    message: "Missing fields",
                    code: EError.INVALID_TYPES_ERROR
                });
            }
            // Si el usuario no existe aún, crearlo
            const hashPass = await hashPassword(password);
            const createUser = await userModel.create({
                first_name,
                last_name,
                email,
                password: hashPass,
                age,
                previousPasswords: [hashPass]
            });

            return done(null, createUser, { message: 'Usuario creado exitosamente.' });

        } catch (error) {
            console.error('Hubo un error al registrar el usuario:', error);
            return done(error, false);
        }
    }));

    //login del usuario
    passport.use('login', new LocalStrategy(
        { usernameField: 'email' }, async (email, password, done) => {
            try {
                const user = await findUserByEmail(email);

                // Si el usuario no existe o la contraseña es incorrecta
                if (!user) {
                    return done(null, false, { message: 'Credenciales inválidas.' });
                }

                // Validar la contraseña
                const isPasswordValid = await validatePassword(password, user.password);

                // Si la contraseña es incorrecta
                if (!isPasswordValid) {
                    return done(null, false, { message: 'Credenciales inválidas.' });
                }
                // Actualizar last_connection
                user.last_connection = new Date();
                await user.save();

                // Si el usuario existe y la contraseña es correcta, retornar el usuario
                return done(null, user);
            }
            catch (error) {
                // Manejo genérico de errores
                return done(error, false, { message: 'Error en el proceso de inicio de sesión.' });
            }
    }));



    passport.use('github', new GithubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await findUserByEmail(profile._json.email);
            if (user) {
                return done(null, user);
            } else {
                const hashPass = await hashPassword(profile._json.email);
                const newUser = await userModel.create({	
                    first_name: profile._json.name,
                    last_name: ' ',
                    email: profile._json.email,
                    age: 18,
                    password: hashPass
                });
                return done(null, newUser);
            }
        } catch (error) {
            return done(error);
        }
    }));

    //Serializar al usuario
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    //Deserializar al usuario
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userModel.findById(id);
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    });
}

export default InitializePassport;