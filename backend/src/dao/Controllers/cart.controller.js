import { cartModel } from "../models/carts.models.js";
import { productModel } from "../models/products.models.js";
import CustomError from '../../services/errors/CustomError.js';
import EError from '../../services/errors/enum.js';
import { generateCartError, generateProductNotFoundError, generateDatabaseError } from '../../services/errors/info.js';

// Crear los controlers de los carritos 
export const getCarts = async (req, res) => {
    const {limit} = req.query;
    try {
        const carts = await cartModel.find().limit(limit);
        res.status(200).send({respuesta: 'ok', mensaje: carts})
    } catch (error){
        if (error.name === 'MongoError' || error.name === 'MongooseError') {
            throw CustomError.createError({
                name: "DatabaseError",
                cause: generateDatabaseError(error.message),
                message: "Ha ocurrido un error al interactuar con la base de datos.",
                code: EError.DATABASE_ERROR
            });
        } else {
            // Otros errores no específicos de la base de datos
            res.status(400).send({respuesta: 'Error', mensaje: error});
        }
    }
}

export const getCart = async (req, res) => {
    const {id} = req.params
    console.log('id', id)
    try {
        const cart = await cartModel.findById(id);
        if (cart) {
            const totalQuantity = cart.products.reduce((acc, product) => acc + product.quantity, 0);
            const totalAmount = cart.products.reduce((acc, product) => acc + (product.quantity * product.id_prod.price) , 0);
            res.status(200).send({respuesta: 'ok', payload: {cart, totalQuantity, totalAmount}})
        } else 
            res.status(404).send({respuesta: 'Error', err: 'Product not found'})
    } catch (error){
        if (error.name === 'MongoError' || error.name === 'MongooseError') {
            throw CustomError.createError({
                name: "DatabaseError",
                cause: generateDatabaseError(error.message),
                message: "Ha ocurrido un error al interactuar con la base de datos.",
                code: EError.DATABASE_ERROR
            });
        } else {
            // Otros errores no específicos de la base de datos
            res.status(400).send({respuesta: 'Error', mensaje: error});
        }
    }
}


export const createCartLogic = async () => {
    try {
        console.log('Creating cart');
        const cart = await cartModel.create({});
        console.log('Cart created: ', cart);
        return cart;
        } catch (error) {
            if (error.name === 'MongoError' || error.name === 'MongooseError') {
                throw CustomError.createError({
                    name: "DatabaseError",
                    cause: generateDatabaseError(error.message),
                    message: "Ha ocurrido un error al interactuar con la base de datos.",
                    code: EError.DATABASE_ERROR
                });
            } else {
                // Otros errores no específicos de la base de datos
                res.status(400).send({respuesta: 'Error', mensaje: error});
            }
        throw error;
        }
    };
    
    export const createCart = async (req, res) => {
        try {
        const cart = await createCartLogic();
        return res.status(201).send({respuesta: 'ok', mensaje: cart});
        } catch (error) {
            if (error.name === 'MongoError' || error.name === 'MongooseError') {
                throw CustomError.createError({
                    name: "DatabaseError",
                    cause: generateDatabaseError(error.message),
                    message: "Ha ocurrido un error al interactuar con la base de datos.",
                    code: EError.DATABASE_ERROR
                });
            } else {
                // Otros errores no específicos de la base de datos
                res.status(400).send({respuesta: 'Error', mensaje: error});
            }
        throw error;
        }
    };
    

export const cleanCart = async (req, res) => {
    const {cid} = req.params
    try {
        const cart = await cartModel.findById(cid);
        console.log('cart', cart)
        if (cart) {
            cart.products = [];
            await cart.save();
            const totalQuantity = 0
            res.status(200).send({respuesta: 'ok', payload: { mensaje: cart, totalQuantity}});
        }
        else 
            res.status(404).send({respuesta: 'Error', mensaje: 'Cart not found'})
    } catch (error){
        if (error.name === 'MongoError' || error.name === 'MongooseError') {
            throw CustomError.createError({
                name: "DatabaseError",
                cause: generateDatabaseError(error.message),
                message: "Ha ocurrido un error al interactuar con la base de datos.",
                code: EError.DATABASE_ERROR
            });
        } else {
            // Otros errores no específicos de la base de datos
            res.status(400).send({respuesta: 'Error', mensaje: error});
        }
    }
}

export const restartCart = async (cartId, products) => {
    try {
        const cart = await cartModel.findById(cartId);
        if (cart) {
            products.forEach(async (product) => {
                const index = cart.products.findIndex(prod => prod.id_prod._id.toString() === product.id.toString());
                if (index !== -1) {
                    cart.products.splice(index, 1);
                }
            });
            await cart.save();
        }
        else 
            console.log("Cart not found for cleaning");
    } catch (error){
        if (error.name === 'MongoError' || error.name === 'MongooseError') {
            throw CustomError.createError({
                name: "DatabaseError",
                cause: generateDatabaseError(error.message),
                message: "Ha ocurrido un error al interactuar con la base de datos.",
                code: EError.DATABASE_ERROR
            });
        } else {
            // Otros errores no específicos de la base de datos
            res.status(400).send({respuesta: 'Error', mensaje: error});
        }
    }
}

export const addOrUpdateProductInCart = async (req, res) => {
    const {cid, pid} = req.params;
    const {quantity} = req.body;
    console.log('quantity', quantity)   
    console.log('pid', pid)
    console.log('cid', cid)

    try {
        const cart = await cartModel.findById(cid);
        console.log('cart', cart)
        if (!cart) {
            throw CustomError.createError({
                name: "CartNotFoundError",
                cause: generateCartError(cid),
                message: `Cart with ID ${cid} not found`,
                code: EError.NOT_FOUND_ERROR
            });
        }

        const product = await productModel.findById(pid);
        console.log('product', product)
        if (!product) {
            throw CustomError.createError({
                name: "ProductNotFoundError",
                cause: generateProductNotFoundError(pid),
                message: `Product with ID  not found`,
                code: EError.NOT_FOUND_ERROR
            });
        }

        const index = cart.products.findIndex(prod => prod.id_prod.toString() === pid);
        if (index !== -1) {
            cart.products[index].quantity = quantity;
        } else {
            cart.products.push({ id_prod: pid, quantity: quantity });
        }
        await cart.save();
        const totalQuantity = cart.products.reduce((acc, product) => acc + product.quantity, 0);
        res.status(200).send({respuesta: 'ok', payload: {mensaje: cart, totalQuantity}});
    } catch (error) {
        if(error.code) {
            next(error);
        }
        if (error.name === 'MongoError' || error.name === 'MongooseError') {
            throw CustomError.createError({
                name: "DatabaseError",
                cause: generateDatabaseError(error.message),
                message: "Ha ocurrido un error al interactuar con la base de datos.",
                code: EError.DATABASE_ERROR
            });
        } else {
            // Otros errores no específicos de la base de datos
            res.status(400).send({respuesta: 'Error', mensaje: error});
        }
    throw error;
    }
};


export const removeProductbyId = async (req, res) => {
    const {cid, pid} = req.params
    try {
        const cart = await cartModel.findById(cid);
        console.log('cart', cart)
        if (cart) {
            const product = await productModel.findById(pid);
            if (product) {
                console.log('product', product)
                const quantity = product.quantity;
                const index = cart.products.findIndex(prod => prod.id_prod._id.toString() === pid);
                if (index !== -1) {
                    cart.products.splice(index, 1);
                    await cart.save();
                    res.status(200).send({respuesta: 'ok', payload: { mensaje: cart, quantity }})
                } else {
                    res.status(404).send({respuesta: 'Error', mensaje: `Product ${pid} not found in the cart ${cid}`})
                }
            }
            else 
                res.status(404).send({respuesta: 'Error', mensaje: 'Product not found'})
        }
        else 
            res.status(404).send({respuesta: 'Error', mensaje: 'Cart not found'})
    } catch (error){
        res.status(400).send({respuesta: 'Error', mensaje: error})
    }
}


export const updateCartWithProducts = async (req, res) => {
    const {cid} = req.params
    const {products} = req.body
    try {
        const cart = await cartModel.findById(cid);
        if (!cart) {
            throw new Error("Cart not found");
        }
        for (let prod of products) {
            // Verifica si el producto ya existe en el carrito
            const index = cart.products.findIndex(cartProduct => cartProduct.id_prod._id.toString() === prod.id_prod);
            if (index !== -1) {
                // Si ya existe, actualizamos la cantidad
                cart.products[index].quantity = prod.quantity;
            } else {
                // Si no existe, primero validamos que el producto exista en la base de datos
                const exists = await productModel.findById(prod.id_prod);
                if (!exists) {
                    throw new Error(`Product with ID ${prod.id_prod} not found`);
                }
                // Añade el producto al carrito
                cart.products.push(prod);
            }
        }
        await cart.save();
        res.status(200).send({ respuesta: 'OK', mensaje: 'Cart updated successfully' });
    } catch (error){
        res.status(400).send({respuesta: 'Error', mensaje: error})
    }
}

//Exportar todas las funciones juntas como cartController   
export const cartController = { 
    getCarts,
    getCart,
    createCart,
    cleanCart,
    addOrUpdateProductInCart,
    removeProductbyId,
    updateCartWithProducts,
    restartCart
}
