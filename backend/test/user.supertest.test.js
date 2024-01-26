import chai from 'chai';
import mongoose from 'mongoose';
import dotenv from 'dotenv';    
import supertest from 'supertest';

const expect = chai.expect;
dotenv.config();

let test_user_email = 'mailprueba@prueba.co'
let test_user_id = null;

const api = supertest('http://localhost:4000/api');

await mongoose.connect(`mongodb+srv://curso_backend_juan:${process.env.passmongodb}@cluster0.c47d4cv.mongodb.net/?retryWrites=true&w=majority`);

describe(' test user model CRUD en la ruta api/users', function () {        
    describe('ruta api/users metodo post', function () {
        let token = null;
        it('crear un usuario mediante post ', async function() { // Increase timeout here
            this.timeout(5000); // Increase timeout to 5000ms
            const newuser = {
                first_name: 'Juan',
                last_name: 'Perez',
                age: 30,
                email: test_user_email,
                password: '1234'    
            };
            const { statusCode, _body, ok} = await api.post('/users/signup').send(newuser);
            expect(statusCode).to.be.equal(200);
        });

        it('solicitar datos de usuarios mediante GET en /users/email/:email', async function() { // Increase timeout here
            this.timeout(5000); // Increase timeout to 5000ms
            const { statusCode, _body, ok} = await api.get(`/users/email/${test_user_email}`);
            test_user_id = _body._id;
            expect(statusCode).to.be.equal(200);
        });

        it('actualizar usuario mediante PUT en /users/:id', async function() { // Increase timeout here
            this.timeout(5000); // Increase timeout to 5000ms
            const user = {
                first_name: 'Juan',
                last_name: 'Perez',
                age: 30
            };
            const { statusCode, _body, ok} = await api.put(`/users/${test_user_id}`).send(user);
            expect(statusCode).to.be.equal(200);    
        });

        it('iniciar sesion con post a traves de /sessions/login', async function() { // Increase timeout here 
            this.timeout(5000); // Increase timeout to 5000ms
            const user = {
                email: test_user_email,
                password: '1234'
            };
            const { statusCode, _body, ok} = await api.post('/sessions/login').send(user);
            token = _body.token;
            expect(statusCode).to.be.equal(200);
            expect(token).to.be.ok;
        });

        it('consultar datos de usuario a traves de GET en sessions/current', async function() { // Increase timeout here')
            this.timeout(5000); // Increase timeout to 5000ms
            const { statusCode, _body, ok} = await api.get('/sessions/current').set('Authorization', `Bearer ${token}`);
            expect(statusCode).to.be.equal(200);
            expect(_body).to.be.ok;
            expect(_body.user.email).to.be.equal(test_user_email);
        });

        it('eliminar usuario mediante DELETE en /users/:id', async function() { // Increase timeout here
            this.timeout(5000); // Increase timeout to 5000ms
            const { statusCode, _body, ok} = await api.delete(`/users/${test_user_id}`);
            expect(statusCode).to.be.equal(200);
        });
    });
});
