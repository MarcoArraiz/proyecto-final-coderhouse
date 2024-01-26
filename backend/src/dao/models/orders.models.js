import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
import { userModel } from "./user.models.js";

const orderSchema = new Schema({
    totalAmount: {
        type: Number,
        required: true
    },
    totalQuantity: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true,
        default: 0
    },
    finalAmount: {
        type: Number,
        required: true
    },
    products: [{
        id: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        code: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        }
    }],
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        default: "Pendiente de pago"
    },
    address: {
        type: String,
        required: true
    },
    orderCode: {
        type: String,
        required: true,
        unique: true
    },
    purchaser: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

orderSchema.plugin(mongoosePaginate);

// hacer populate de los datos del usuarios a traves de la ref a la coleccion de usuarios
orderSchema.pre('save', async function (next) {
    if (!this.user_id) {
        next(); // Si no hay user_id, continúa sin modificar purchase
    } else {
        try {
            // Suponiendo que tienes un modelo de usuario llamado UserModel
            const user = await userModel.findById(this.user_id);
            if (user && user.email) {
                this.purchaser = user.email; // Asigna el email del usuario a purchase
            }
            next();
        } catch (error) {
            next(error); // Propaga el error si ocurre
        }
    }
});


export const OrderModel = model('Order', orderSchema);
