import { productModel } from '../models/products.models.js';
import CustomError from '../../services/errors/CustomError.js';
import EError from '../../services/errors/enum.js';
import { generateProductError } from '../../services/errors/info.js';
import { generateProduct } from '../../utils/generateProduct.js'; // Asegúrate de que la ruta sea correcta



/// en controller se hace normalmente se hace metodod HTTP + Modelo para referirse al nombre del controladr
export const getProducts = async (req, res) => {
    const {limit, page, filter, sort} = req.query;

    const pag = page ? parseInt(page):1;
    const lim = limit ? parseInt(limit):10;
    const ord = sort === 'asc' ? 1 : -1;

    try {
        const prods = await productModel.paginate({filer: filter}, {limit: lim, page: pag, sort: {price: ord}});
        if(prods) {
            // Construir las URLs para prevLink y nextLink
            const buildUrl = (page) => `http://${req.headers.host}${req.baseUrl}?limit=${lim}&page=${page}&filter=${filter}&sort=${sort}`;

            const response = {
                status: "success",
                payload: prods.docs, // Resultado de los productos solicitados
                totalPages: prods.totalPages,
                prevPage: prods.prevPage,
                nextPage: prods.nextPage,
                page: prods.page,
                hasPrevPage: prods.hasPrevPage,
                hasNextPage: prods.hasNextPage,
                prevLink: prods.hasPrevPage ? buildUrl(prods.prevPage) : null,
                nextLink: prods.hasNextPage ? buildUrl(prods.nextPage) : null
            };
            return res.status(200).send(response)
        }
        res.status(404).send({message: 'No se encontraron productos'})
    } catch (error) {
        console.log(error);
        res.status(500).send({message: 'Error al obtener los productos'})
    }
}

export const getProduct = async (req, res) => {
    const {id} = req.params;

    try {
        const prod = await productModel.findById(id);

        if(prod) {
            return res.status(200).send(prod)
        }
        res.status(404).send({message: 'No se encontró el producto'})
    } catch (error) {
        res.status(500).send({message: 'Error al obtener el producto'})
    }
}

export const createProduct = async (req, res) => {
    const {title, description, price, stock, category, code} = req.body;
    try {
        // Registro a nivel debug
        if (!title || !description || !code || !price || !stock || !category) {
            req.logger.debug(`Intento de creación de producto con datos faltantes: ${JSON.stringify(req.body)}`);
            throw CustomError.createError({
                name: "Product Creation Error",
                cause: generateProductError({title, description, price, stock, category, code}),
                message: "Parameter missing.",
                code: EError.VALIDATION_ERROR
            });
        }
        const product = await productModel.create({title, description, price, stock, category, code});

        if(product) {
            return res.status(201).send(product)
        } else {
        // Si la creación del producto falla y no lanza una excepción
        req.logger.error('Error inesperado durante la creación del producto');
        res.status(400).send({message: 'No se pudo crear el producto'})
        }
    } catch (error) {
         // Registro de errores a nivel error
        req.logger.error(`Error en createProduct: ${error.message}`);
        if(error.code === 11000) {
            return res.status(400).send({message: `El producto de codigo ${code} ya existe`})
        }
        res.status(500).send({ message: error.message || 'Error al crear el producto' })
    }
}

export const updateProduct = async (req, res) => {
    const {id} = req.params;
    const {name, description, price, stock, image, category} = req.body;

    try {
        const product = await productModel.findByIdAndUpdate(id, {name, description, price, stock, image, category}, { new: true })
        if(product) {
            return res.status(200).send(product)
        }
        res.status(400).send({message: `Producto ${code} no encontrado` })
    } catch (error) {
        res.status(500).send({message: 'Error al actualizar el producto'})
    }
}

export const deleteProduct = async (req, res) => {
    const {id} = req.params;

    try {
        const product = await productModel.findByIdAndDelete(id);

        if(product) {
            return res.status(200).send({message: 'Producto eliminado'})
        }
        res.status(400).send({message: 'No se pudo eliminar el producto'})
    } catch (error) {
        res.status(500).send({message: 'Error al eliminar el producto'})
    }
}


export const createMockProduct = async (req, res) => {
    const mockProduct = generateProduct();
    console.log('mockProduct', mockProduct);
    try {
        const product = await productModel.create(mockProduct);
        return res.status(201).send(product);
    } catch (error) {
        console.log(error); // Mostrar el error en la consola
        if (error.code === 11000) {
            // Manejar el error de duplicado, tal vez reintentando
            return res.status(400).send({ message: 'Producto duplicado, intentando de nuevo...' });
            // Aquí podrías implementar un reintento o manejar el error como prefieras
        }
        res.status(500).send({ message: error.message || 'Error al crear el producto' });
    }
};

export const createMockProducts = async (req, res) => {
    const numberOfProducts = parseInt(req.params.number, 10);
    // Check if numberOfProducts exceeds the maximum limit
    if (numberOfProducts > 100) {
        numberOfProducts = 100
    }

    try {
        const products = [];
        for (let i = 0; i < numberOfProducts; i++) {
            const mockProduct = generateProduct();
            const createdProduct = await productModel.create(mockProduct);
            products.push(createdProduct);
        }
        return res.status(201).send(products);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message || 'Error al crear los productos' });
    }
};


// Exportar todas las funciones juntas en un objeto
export const productController = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    createMockProduct,
    createMockProducts
}

