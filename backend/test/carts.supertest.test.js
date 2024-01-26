import chai from 'chai';
import mongoose from 'mongoose';
import dotenv from 'dotenv';    
import supertest from 'supertest';

const expect = chai.expect;
dotenv.config();

let token = null;
let test_cart_id = null;
let test_product_id = '64f92264d6811b240fd7e5f5';

const api = supertest('http://localhost:4000/api');

await mongoose.connect(`mongodb+srv://curso_backend_juan:${process.env.passmongodb}@cluster0.c47d4cv.mongodb.net/?retryWrites=true&w=majority`);

describe('test CRUD de las rutas /api/carts', function () {
    
        before( () => {
            console.log('before the test')
        })
    
        describe('ruta api/carts metodo post', function () {
    
            it('iniciar sesion con post a traves de /sessions/login', async function() { // Increase timeout here 
                this.timeout(5000); // Increase timeout to 5000ms
                const user = {
                    email: 'lalolanda12@gmail.com',
                    password: '123456'
                };
                const { statusCode, _body, ok} = await api.post('/sessions/login').send(user);
                token = _body.token;
                expect(statusCode).to.be.equal(200);
                expect(token).to.be.ok;
            });

            //crear un cart mediante POST
            it('crear un cart mediante post ', async function() { // Increase timeout here
                this.timeout(5000); // Increase timeout to 5000ms
                const { statusCode, _body, ok} = await api.post('/carts')
                console.log(_body)
                test_cart_id = _body.mensaje._id;
                expect(statusCode).to.be.equal(201);
                
            });

            //agregar un producto a un cart mediante PUT
            it('agregar un producto a un cart mediante PUT en /carts/:cid/products/:pid', async function() { // Increase timeout here
                this.timeout(5000); // Increase timeout to 5000ms
                const quantity = {
                    quantity: 1
                };
                const { statusCode, _body, ok} = await  api.put(`/carts/${test_cart_id}/products/${test_product_id}`).send(quantity)
                console.log(_body)
                expect(statusCode).to.be.equal(200);
                expect(_body.payload.mensaje).not.to.be.deep.equal([])
                
            });

            //eliminar cart mediante DELETE en /carts/:id
            it('eliminar cart mediante DELETE en /carts/:id', async function() { // Increase timeout here
                this.timeout(5000); // Increase timeout to 5000ms
                const { statusCode, _body, ok} = await api.delete(`/carts/${test_cart_id}`)
                expect(statusCode).to.be.equal(200);

            });
        });
    });