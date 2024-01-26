import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
import { cartModel } from './carts.models.js';


const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true,
        index: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    previousPasswords: [{
        type: String
    }],
    rol: {
        type: String,
        enum: ['user', 'admin','premium'],
        default: 'user'
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'carts'
    },
    email_verified: {
        type: Boolean,
        default: false
    },
    email_verification_code: {
        type: String,
        default: null
    },
    verification_code_expiry: {
        type: Date,
        default: null
    },
    documents: [{
        name: String,
        reference: String
    }],
    last_connection: {
        type: Date,
        default: null
    }

})

userSchema.plugin(mongoosePaginate)

userSchema.pre('save', async function(next) { 
    try {
        if (!this.isNew) return next();

        const newCart = await cartModel.create({});

        if (!newCart) {
            console.error('Failed to create a new cart. newCart is null.');
            return next(new Error('Failed to create a new cart.'));
        }

        this.cart = newCart._id;
    } catch (error) {
        console.error('Error in pre-save hook:', error);
        return next(error);
    }
});
//Parametro 1:Nombre coleccion - Parametro 2: Schema 
export const userModel = model('users', userSchema)