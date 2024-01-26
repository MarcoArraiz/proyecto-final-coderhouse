import { OrderModel } from '../models/orders.models.js';
import { userModel } from '../models/user.models.js';
import { cartModel } from '../models/carts.models.js';
import { cartController } from './cart.controller.js';
import { sendOrderConfirmationEmail } from '../../config/mailer.js';
import { productModel } from '../models/products.models.js';
import CustomError from '../../services/errors/CustomError.js';
import EError from '../../services/errors/enum.js';
import { generateStockError, generateProductNotFoundError } from '../../services/errors/info.js'
import { logStockErrors } from '../../services/errors/log.js';


//Generar un código unico de 6 digitos que se usará como código de orden en el parametro "code" de la orden
const generateUniqueCode = async () => {
    while (true) {
        console.log('Generating unique code...');
        const code = Math.floor(100000 + Math.random() * 900000).toString(); // Genera un código de 6 dígitos
        console.log('Generated code: ', code);
        const existingOrder = await OrderModel.findOne({ orderCode: code });
        if (!existingOrder) {
            return code;
        }
        console.log('Existing order found for code ', code);
    }
};

// Crear una función para verificar y reducir el stock de cada producto
const verifyAndReduceStock = async (req, products) => {
    let verifiedProducts = [];
    let stockErrors = [];

    for (let product of products) {
        const productInDb = await productModel.findById(product.id);
        if (productInDb) {
            if (product.quantity <= productInDb.stock) {
                productInDb.stock -= product.quantity;
                await productInDb.save();
                verifiedProducts.push(product);
            } else {
                // Registro de error de stock insuficiente
                const errorInfo = generateStockError(product.id, product.quantity, productInDb.stock);
                req.logger.error("StockErrorlogger: " + errorInfo);  // Utilizando el logger para registrar el error
                stockErrors.push(errorInfo);
            }
        } else {
            throw CustomError.createError({
                name: "ProductNotFoundError",
                cause: generateProductNotFoundError(product.id),
                message: "Producto no encontrado.",
                code: EError.NOT_FOUND_ERROR
            });
        }
    }
    logStockErrors(stockErrors);
    return verifiedProducts;
};

// Crear una orden nueva
/**
 * Creates a new order with the given cartId, products, and totalAmount.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The saved order.
 */
const createOrder = async (req, res) => {
    const { cid } = req.params;
    const { address } = req.body;
    console.log('body', req.body)
    try {
        // Obtener el carrito del usuario
        const cart = await cartModel.findById(cid);
        console.log('cart', cart)
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        // Buscar el usuario basado en el cart_id
        const user = await userModel.findOne({ cart: cid });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Utilizar los productos del carrito
        let products = cart.products.map(item => ({
            id: item.id_prod._id,
            price: item.id_prod.price,
            quantity: item.quantity,
            title: item.id_prod.title,
            code: item.id_prod.code
        }));
        console.log('products', products)
        products = await verifyAndReduceStock(req, products);
        // Obtener detalles del producto y calcular el totalAmount
        let totalAmount = 0;
        let totalQuantity = 0;
        for (let product of products) {
            const productInDb = await productModel.findById(product.id);
            if (productInDb) {
                totalAmount += productInDb.price * product.quantity;
                totalQuantity += product.quantity;
            }
        }
        // Verificar si el usuario es premium
        let discount = 0;
        if (user && user.rol === 'premium') {
            discount = totalAmount * 0.1; // 10% de descuento
        }
        const finalAmount = totalAmount - discount;
        console.log('EMAIL user', user.email)
        const orderCode = await generateUniqueCode();
        const newOrder = new OrderModel({
            address: req.body.address,
            user_id: user._id,
            totalQuantity,
            orderCode,
            products,
            totalAmount,
            discount,
            finalAmount,
            purchaser: user.email // Asegúrate de que el correo electrónico del usuario se esté estableciendo aquí
        });
        const savedOrder = await newOrder.save();
        if (savedOrder) {
            try {
                await cartController.restartCart(cid, products);
                const email = savedOrder.purchaser;
                console.log('EMAIL', email)
                // console.log('Sending order confirmation email...', orderCode, products, totalAmount, email);
                await sendOrderConfirmationEmail(orderCode, products, totalAmount, discount, finalAmount, email);
            } catch (error) {
                await OrderModel.findByIdAndDelete(savedOrder._id);
                await cartController.restartCart(cid, products, true);
                return res.status(500).json({ message: error.message });
            }
        }
        res.status(201).json({ payload: savedOrder });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// Consultar una orden especifica en base al id
const getOrderById = async (req, res) => {
    try {
        const order = await OrderModel.findById(req.params.id);
        if (!order) {
        return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ payload: order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Consultar todas las ordenes en base al id de user
const getAllOrdersByUserId = async (req, res) => {
    try {
        const orders = await OrderModel.find({ userId: req.params.userId });
        res.json({ payload: orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Modificar el campo Status de una orden especifica en base al id
const updateOrderStatusById = async (req, res) => {
    try {
        const updatedOrder = await OrderModel.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
        );
        if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ payload: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const orderController = {
    createOrder,
    getOrderById,
    getAllOrdersByUserId,
    updateOrderStatusById,
};
