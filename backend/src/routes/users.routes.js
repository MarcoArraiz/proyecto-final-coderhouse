import {Router } from "express"
import passport from 'passport';
import { sendVerificationEmail } from "../config/mailer.js";
import { userController } from "../dao/Controllers/user.controller.js"; 
import upload from '../config/multerConfig.js';

const userRouter = Router();


// Reemplazar llamadas a userManager con userController
userRouter.get('/', userController.getUsers);
userRouter.get('/:id', userController.getUser);
userRouter.get('/email/:email', userController.getUserByEmail);
userRouter.delete('/', userController.deleteUserByLastConnection);
userRouter.delete('/uid', userController.deleteUser)

userRouter.post('/signup', async (req, res, next) => {
    passport.authenticate('signup', async (error, user, info) => {
        console.log('error', error);
        if (error || !user) {
            console.log('llega aqui')
            // Maneja el error o la falta del usuario
            return next(error);
        }
        try {
            if (!user) throw new Error(info.message);
            // Generar código de verificación

            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // Código de 6 dígitos
            const expiryTime = new Date(new Date().getTime() + 30 * 60000); // 30 minutos desde ahora

            // Actualizar usuario con el código y la hora de expiración
            user.email_verification_code = verificationCode;
            user.verification_code_expiry = expiryTime;
            // Guardar el usuario actualizado
            await user.save();
            // Generar y enviar el correo con el código de verificación
            // await sendVerificationEmail(user.email, verificationCode);
            req.logIn(user, function(err) {
                if (err) {
                    throw new Error(err);
                }
                return res.status(200).send({ resultado: 'Usuario creado exitosamente.' });
            });
        } catch (error) {
            console.error('Hubo un error al registrar el usuario:', error);
            res.status(500).send({ mensaje: `Error al registrar: ${error.message}` });
        }
    })(req, res, next);
});


userRouter.get('/failregister', userController.failRegister);
userRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), userController.github);
userRouter.get('/githubCallback', passport.authenticate('github', {scope: ['user:email']}), userController.githubCallback);
userRouter.put('/:id', userController.updateUser);
userRouter.delete('/:id', userController.deleteUser);
userRouter.post('/request-reset-password', userController.requestResetPassword);
userRouter.post('/reset-password', userController.resetPassword);
userRouter.put('/premium/:uid', userController.upgradeToPremium);
userRouter.post('/verify-code', userController.verifyCode);
userRouter.post('/:uid/documents', upload.array('document', 4), userController.uploadUserDocuments);




export default userRouter
