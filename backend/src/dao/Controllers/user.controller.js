import { userModel } from "../models/user.models.js";
import CustomError from "../../services/errors/CustomError.js";
import EError  from "../../services/errors/enum.js";
import { generateUserError, generateDocumentationError } from "../../services/errors/info.js";
import { generateToken } from "../../utils/jwt.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "../../config/mailer.js";
import { validatePassword, hashPassword } from "../../utils/bcrypt.js";
import jwt from 'jsonwebtoken';

// controladores del modelo de usuarios
export const getUsers = async (req, res) => {
    const {limit, page} = req.query;
    let query = {};  
    let options = {
        lim: parseInt(limit) || 10,
        pag: parseInt(page) || 1,
        select: 'first_name last_name email rol'
    };

    try {
        const users = await userModel.paginate(query, options);

        if(users) {
            return res.status(200).send({payload: users})
        }
        res.status(404).send({message: 'No se encontraron usuarios'})
    } catch (error) {
        res.status(500).send({message: 'Error al obtener los usuarios'})
    }
}

export const getUser = async (req, res) => {
    const {id} = req.params;

    try {
        const user = await userModel.findById(id);

        if(user) {
            return res.status(200).send(user)
        }
        res.status(404).send({message: 'No se encontró el usuario'})
    } catch (error) {
        res.status(500).send({message: 'Error al obtener el usuario'})
    }
}

const findUserByEmail = async (email) => {
    return await userModel.findOne({ email: email });
};

export const getUserByEmail = async (req, res) => {
    const {email} = req.params;

    try {
        // const user = await userModel.findOne({ email: email });
        const user = await findUserByEmail(email);
        if(user) {
            return res.status(200).send(user)
        }
        res.status(404).send({message: 'No se encontró el usuario'})
    } catch (error) {
        res.status(500).send({message: 'Error al obtener el usuario'})
    }
}

export const createUser = async (req, res) => {
    const {first_name, last_name, email, password, age} = req;
    try {
        if(!first_name|| !last_name || !email || !password || !age) {
            console.log("Missing fields");
            CustomError.createError({
                name: "Use creation error",
                cause: generateUserError({first_name, last_name, email, password, age}),
                message: "Missing fields",
                code: EError.INVALID_TYPES_ERROR
            })  
        }
        const user = await userModel.create({first_name, last_name, email, password, age});
        if(user) {
            return res.status(201).send(user)
        }
        res.status(400).send({message: 'No se pudo crear el usuario'})
    } catch (error) {
        if(error.code === 11000) {
            return res.status(400).send({message: 'El email ya existe'})
        }
        res.status(500).send({message: 'Error al crear el usuario'})
    }
}

export const updateUser = async (req, res) => {
    const {id} = req.params;
    const {name, lastName, email, password, role} = req.body;

    try {
        const user = await userModel.findByIdAndUpdate(id, {name, lastName, email, password, role}, {new: true});

        if(user) {
            return res.status(200).send(user)
        }
        res.status(404).send({message: 'No se encontró el usuario'})
    } catch (error) {
        res.status(500).send({message: 'Error al actualizar el usuario'})
    }
}

export const deleteUser = async (req, res) => {
    const {id} = req.params;

    try {
        const user = await userModel.findByIdAndDelete(id);

        if(user) {
            return res.status(200).send(user)
        }
        res.status(404).send({message: 'No se encontró el usuario'})
    } catch (error) {
        res.status(500).send({message: 'Error al eliminar el usuario'})
    }
}

const userSignup = async (req, res) => {
    try {
        if(!req.user){
            res.status(401).send({ resultado: 'Usuario invalido' });
        }

        res.status(200).send({ resultado: 'Usuario creado exitosamente.' });
    }
    catch (error) {
        console.error('Hubo un error al registrar el usuario:', error);
        res.status(500).send({ mensaje: `Error al registrar ${error}` });
    }
};

const failRegister = (req, res) => {
    console.log('Error al registrar');
    res.status(401).send({ resultado: 'Error al registrar' });
};

const github = (req, res) => {
    res.status(200).send({ resultado: 'Usuario creado exitosamente.' });
};

const githubCallback = (req, res) => {
    res.status(200).send({ resultado: 'Usuario creado exitosamente.' });
};

export const requestResetPassword = async (req, res) => {
    const { email } = req.body;
    console.log('email', email);
    try {
        // 1. Verificar si el usuario existe
        const user = await userModel.findOne({ email: email });
        if (!user) {
            req.logger.debug(`Restablecimiento de contraseña solicitado para email no registrado: ${email}`);
            return res.status(404).send({ message: 'Usuario no encontrado' });
        }

        // 2. Generar token de restablecimiento
        const resetToken = generateToken(user);  // Usando JWT para generar un token
        // Aquí puedes añadir lógica para guardar el token en la base de datos si es necesario

        // 3. Enviar email al usuario con instrucciones para restablecer la contraseña
        await sendPasswordResetEmail(email, resetToken);  // Asumiendo que el email incluirá el token


        res.status(200).send({ message: 'Instrucciones para restablecer la contraseña enviadas al correo electrónico.' });
    } catch (error) {
        req.logger.error(`Error en solicitud de restablecimiento de contraseña: ${error.message}`);
        res.status(500).send({ message: 'Error en la solicitud de restablecimiento de contraseña' });
    }
};

export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    const decodedToken = token.replace(/_dot_/g, '.'); // Reemplaza '_dot_' de nuevo con puntos

    try {
        // 1. Verificar el token
        const decoded = jwt.verify(decodedToken, process.env.JWT_SECRET);
        if (!decoded || !decoded.user) {
            return res.status(400).send({ message: 'Token inválido o expirado' });
        }

        // 2. Buscar el usuario asociado al token
        const user = await userModel.findById(decoded.user._id);
        if (!user) {
            return res.status(404).send({ message: 'Usuario no encontrado' });
        }

        // 3. Validar y actualizar la contraseña
        if (!newPassword) {
            return res.status(400).send({ message: 'Contraseña no válida' });
        }

        // 4. Verificar que la nueva contraseña no sea una de las antiguas
        const isOldPassword = user.previousPasswords && await Promise.any(user.previousPasswords.map(async (oldPassword) => {
            return validatePassword(newPassword, oldPassword);
        }));

        if (isOldPassword) {
            return res.status(400).send({ message: 'No puedes usar una contraseña antigua.' });
        }

        // 5. Actualizar la contraseña
        user.password = await hashPassword(newPassword);
        // 6. almaceno la contraseña 
        user.previousPasswords.push(user.password);
        user.previousPasswords = user.previousPasswords.slice(-5);
        await user.save();

        res.status(200).send({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).send({ message: 'Token expirado' });
        }
        req.logger.error(`Error en restablecimiento de contraseña: ${error.message}`);
        res.status(500).send({ message: 'Error al restablecer la contraseña' });
    }
};

export const verifyCode = async (req, res) => {
    const { email, verificationCode } = req.body;

    try {
        const user = await userModel.findOne({ email: email });

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        if (user.email_verified) {
            throw new Error('El usuario ya ha sido verificado');
        }

        if (user.email_verification_code !== verificationCode) {
            throw new Error('Código de verificación incorrecto');
        }

        if (user.verification_code_expiry < new Date()) {
            throw new Error('El código de verificación ha expirado');
        }

        user.email_verified = true;
        user.email_verification_code = null;
        user.verification_code_expiry = null;

        await user.save();

        res.status(200).send({ message: 'Usuario verificado correctamente' });
    } catch (error) {
        console.error('Error al verificar el usuario:', error);
        res.status(500).send({ message: 'Error al verificar el usuario' });
    }
};

export const uploadUserDocuments = async (req, res) => {
    const userId = req.params.uid;
    const files = req.files;

    if (!files || files.length === 0) {
        return res.status(400).send({ message: 'No se subieron archivos.' });
    }

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).send({ message: 'Usuario no encontrado.' });
        }

        const updatedDocuments = files.map(file => ({
            name: file.originalname,
            reference: file.path // O cualquier lógica para generar la referencia
        }));

        user.documents.push(...updatedDocuments);
        await user.save();

        res.status(200).send({ message: 'Documentos subidos exitosamente.', documents: user.documents });
    } catch (error) {
        console.error('Error al subir documentos:', error);
        res.status(500).send({ message: 'Error al subir documentos' });
    }
};


export const upgradeToPremium = async (req, res, next) => {
    const userId = req.params.uid;

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            throw CustomError.createError({
                name: "User Not Found",
                message: "Usuario no encontrado.",
                code: EError.NOT_FOUND_ERROR,
                cause: "usuario no encontrado"
            }); 
        }
        if(user.rol === 'premium'){
            return res.status(400).send({ message: 'El usuario ya es premium.' });
        }
        // Verificar si hay al menos un archivo en '/uploads/documents/' que contenga "document-" en su nombre
        const hasRequiredDocument = user.documents.some(doc => {
            const fileName = doc.reference.split('/').pop(); // Extrae el nombre del archivo de la ruta
            const regex = /document-/;
            return regex.test(fileName);
        });

        if (!hasRequiredDocument) {
            throw CustomError.createError({
                name: "Documentation Error",
                message: "Falta documentación requerida para ser usuario premium.",
                code: EError.DOCUMENTATION_ERROR,
                cause: generateDocumentationError()
            }); 
        }

        // Actualizar el rol del usuario a premium
        user.rol = 'premium';
        await user.save();
        res.status(200).send({ message: 'Usuario actualizado a premium.' });
    } catch (error) {
        console.error('Error al actualizar a premium:', error);
        console.log('Error al actualizar a premium:', {
            message: error.message,
            name: error.name,
            code: error.code,
            cause: error.cause,
            stack: error.stack
        });
        // Si el error no es uno de los personalizados
        if (error.code) {
            next(error);
        } else {
            res.status(500).send({ message: 'Error al actualizar a premium.' });
        }
    }
};

export const deleteUserByLastConnection = async (req, res) => {
    try {
        const twoDaysAgo = new Date(new Date().setDate(new Date().getDate() - 2));
        
        // Encuentra los usuarios que serán eliminados
        const usersToDelete = await userModel.find({
            $or: [
                { last_connection: { $lt: twoDaysAgo } },
                { last_connection: { $exists: false } },
                { last_connection: null }
            ]
        }).select('email first_name');

        // Extrae los correos electrónicos y nombres de los usuarios
        const userEmails = usersToDelete.map(user => ({ email: user.email, name: user.first_name }));

        // Elimina los usuarios
        const deletedUsers = await userModel.deleteMany({
            $or: [
                { last_connection: { $lt: twoDaysAgo } },
                { last_connection: { $exists: false } },
                { last_connection: null }
            ]
        });

        // Envía correos electrónicos de notificación
        userEmails.forEach(async user => {
            await sendAccountDeletionEmail(user.email, user.name);
        });

        if(deletedUsers.deletedCount === 0) {
            return res.status(404).send({message: 'No hay usuarios para eliminar con la condición especificada'});
        }
        return res.status(200).send({message: `Usuarios eliminados: ${deletedUsers.deletedCount}`});
    } catch (error) {
        res.status(500).send({message: 'Error al eliminar usuarios'});
    }
};





// Exportar todas las funciones juntas
export const userController = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    userSignup,
    failRegister,
    github,
    githubCallback,
    getUserByEmail,
    requestResetPassword,
    resetPassword,
    verifyCode,
    uploadUserDocuments,
    upgradeToPremium,
    deleteUserByLastConnection
}