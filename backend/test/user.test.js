import mongoose from 'mongoose';
import { userModel } from '../src/dao/models/user.models.js';
import Assert from 'assert';
import dotenv from 'dotenv';
import chai from 'chai';

dotenv.config();
const assert = Assert.strict; 
const expect = chai.expect;
let test_id = null;

await mongoose.connect(`mongodb+srv://curso_backend_juan:${process.env.passmongodb}@cluster0.c47d4cv.mongodb.net/?retryWrites=true&w=majority`)
// .then(() => console.log('BDD conectada'))
// .catch(() => console.log('Error en conexion a BDD'))

describe(' test user model CRUD en la ruta api/users', function () {
    // previo a comenzar el test
    before(() => {
        console.log('before the test')
    })

    // previo a arrancar cada test
    beforeEach(() => {
        console.log('before each test')
    })

    //obtene todos los suarios mediante get
    it('obtener todos los usuarios', async () => {
        const users = await userModel.find();
        // assert.strictEqual(Array.isArray(users), true);
        // expect(Array.isArray(users)).to.be.true;
        expect(users).not.to.be.deep.equal([])
    })

    it('obtener un usuario por id', async () => {
        const user = await userModel.findById('6535bea5e9a5226f47c05bd3');
        expect(user).to.have.property('_id')
    })

    it('crear un usuario mediante post ', async () => {
        const user = await userModel.create({
            first_name: 'Juan',
            last_name: 'Perez',
            age: 30,
            email: 'mailrpueba@gmail.com',
            password: '1234'
        })
        test_id = user._id;
        expect(user).to.have.property('_id')
    })

    // 657f6a990a01802ea8524c5f
    it('actualizar un usuario mediante put ', async () => {
        const user = await userModel.findByIdAndUpdate(test_id, {
            first_name: 'Juan',
            last_name: 'Perez',
            age: 30
        }, { new: true });
        assert.strictEqual(user.first_name, 'Juan');
        expect(user).to.have.property('first_name').to.be.equal('Juan');
    })

    // 657f6a990a01802ea8524c5f
    it('borrar un usuario mediante delete ', async () => {
        const user = await userModel.findByIdAndDelete(test_id);
        expect(user).to.be.ok;
    })

})