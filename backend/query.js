// fetchUsersEmails.js
import mongoose from 'mongoose';
import { userModel } from './src/dao/models/user.models.js'; // Asegúrate de que la ruta sea correcta
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URL)
    .then(async () => {
        try {
            const users = await userModel.find().select('email -_id'); // Selecciona solo el campo 'email'
            const emails = users.map(user => user.email);
            console.log('Correos Electrónicos de Usuarios:', emails);
        } catch (error) {
            console.error('Error al obtener los correos electrónicos:', error);
        } finally {
            mongoose.disconnect();
        }
    });

// usuarios a eliminar
const userfordelete = [
    'antonio@antonio.com',
    'marco@marcoarraiz.com',
    'coderhouse@coderhouse.com'
]

// Eliminar usuarios
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        try {
            const users = await userModel.deleteMany({ email: { $in: userfordelete } });
            console.log('Usuarios eliminados:', users.deletedCount);
        } catch (error) {
            console.error('Error al eliminar los usuarios:', error);
        } finally {
            mongoose.disconnect();
        }
    });

mongoose.connect(process.env.MONGO_URL)
    .then(async () => {
        try {
            const users = await userModel.find().select('email -_id'); // Selecciona solo el campo 'email'
            const emails = users.map(user => user.email);
            console.log('Correos Electrónicos de Usuarios:', emails);
        } catch (error) {
            console.error('Error al obtener los correos electrónicos:', error);
        } finally {
            mongoose.disconnect();
        }
    });