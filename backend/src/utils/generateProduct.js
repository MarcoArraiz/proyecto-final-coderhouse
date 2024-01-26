import { es, fakerES } from '@faker-js/faker';

export const generateProduct = () => {
    const generateUUID = () => {
        const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        let uuid = '';
        for (let i = 0; i < 3; i++) {
            uuid += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        for (let i = 0; i < 2; i++) {
            uuid += numbers.charAt(Math.floor(Math.random() * numbers.length));
        }
        return uuid;
    };

    return {
        title: fakerES.commerce.productName(),
        description: fakerES.commerce.productDescription(),
        code: generateUUID().toLowerCase(),
        price: parseFloat(fakerES.commerce.price()),
        stock: fakerES.number.int({ min: 0, max: 1000 }),
        category: fakerES.commerce.department()
    };
};
