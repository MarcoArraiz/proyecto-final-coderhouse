import {promises as fs} from 'fs';

class Cart {
    constructor(id) {
        this.id = id;
        this.products = [];
    }

    addProduct(productId) {
        const productIndex = this.products.findIndex(p => p.product === productId);
        if(productIndex === -1) {
            // Si el producto no existe en el carrito, lo agregamos con una cantidad de 1
            this.products.push({product: productId, quantity: 1});
        } else {
            // Si el producto ya existe, incrementamos su cantidad
            this.products[productIndex].quantity += 1;
        }
    }
}

class CartManager {
    constructor() {
        this.path = './src/models/carts.json';
        this.nextId = 0;
        this.carts = []
    }

    saveToFile = async() => {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
        } catch (error) {
            console.error("Error al guardar los carritos:", error);
        }
    }

    getAllCarts = async() => {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            if (data.length > 0) {
                this.carts = JSON.parse(data);
                const maxIdCart = this.carts.reduce((prev, curr) => (prev.id > curr.id) ? prev : curr);
                this.nextId = maxIdCart.id + 1;
            }
            return this.carts;
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log("Archivo de carritos no encontrado. Se creará uno nuevo.");
                return [];
            } else {
                console.error("Error al leer el archivo de carritos:", error);
            }
        }
    }

    createCart = async() => {
        await this.getAllCarts();
        const newCart = new Cart(this.nextId);
        this.carts.push(newCart);
        this.saveToFile();
        return newCart;
    }

    getCartById = async(id) => {
        await this.getAllCarts();
        const cart = this.carts.find(cart => Number(cart.id) === Number(id));
        if (cart) {
            return cart;
        } else {
            console.log('Carrito no encontrado');
        }
    }

    addProductToCart = async(cartId, productId) => {
        const cartData = await this.getCartById(cartId);
        if(!cartData) {
            throw new Error('Carrito no encontrado');
        } else {
        const cart = Object.assign(new Cart(), cartData);
        cart.addProduct(productId);
        await this.saveToFile();
        }
    }
}

export const cartManager = new CartManager();
