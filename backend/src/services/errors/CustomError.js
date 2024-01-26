import EError from "./enum.js"
export default class CustomError {
    static createError({name="Error",cause,message,code=1}){
        const error = new Error(message);
        error.name = name;
        error.code = code;
        error.cause = cause;
        throw error;
    }
    static createGenericError(message, cause) {
        return this.createError({
            name: "Generic Error",
            message: message || "Ha ocurrido un error inesperado.",
            code: EError.GENERIC_ERROR, // Asegúrate de tener un GENERIC_ERROR en tu enum
            cause: cause
        });
    }
}