import fs from 'fs';
import path from 'path';
import { __dirname } from '../../path.js';

// Esta función asume que los errores vienen en un formato específico
export const logStockErrors = (stockErrors) => {
    const logFilePath = path.join(__dirname, '/services/errors/stockErrors.log'); // Ajusta la ruta según tu estructura de directorios
    const timestamp = new Date().toISOString();
    const logEntries = stockErrors.map(error => 
        `${timestamp} - Producto ID: ${error.productId}, Cantidad Solicitada: ${error.requestedQuantity}, Stock Disponible: ${error.availableStock}\n`
    ).join('');

    fs.appendFile(logFilePath, logEntries, (err) => {
        if (err) {
            console.error('Error al escribir en el archivo de log', err);
        }
    });
};

// Ejemplo de uso
// logStockErrors([{ productId: '123', requestedQuantity: 10, availableStock: 5 }]);
