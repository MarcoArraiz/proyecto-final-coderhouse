import EError from "../../services/errors/enum.js";

const errorHandler = (error, req, res, next) => {
    console.error(error);
    if (error.code === EError.VALIDATION_ERROR) {
        return res.status(400).send({ mensaje: error.message });
    }
    if (error.code === EError.AUTHENTICATION_ERROR) {
        return res.status(401).send({ mensaje: error.message });
    }
    if (error.code === EError.AUTHORIZATION_ERROR) {
        return res.status(403).send({ mensaje: error.message });
    }
    if (error.code === EError.NOT_FOUND_ERROR) {
        return res.status(404).send({ mensaje: error.message });
    }
    if (error.code === EError.BAD_REQUEST_ERROR) {
        return res.status(400).send({ mensaje: error.message });
    }
    if (error.code === EError.FORBIDDEN_ERROR) {
        return res.status(403).send({ mensaje: error.message });
    }
    if (error.code === EError.INTERNAL_SERVER_ERROR) {
        return res.status(500).send({ mensaje: error.message });
    }
    if (error.code === EError.DATABASE_ERROR) {
        return res.status(500).send({ mensaje: error.message });
    }
    if (error.code === EError.INVALID_TYPE_ERROR) {
        return res.status(400).send({ mensaje: error.message });
    }
    if (error.code === EError.DOCUMENTATION_ERROR) {
        return res.status(400).send({ mensaje: error.message });
    }
    // Para errores no catalogados
    if (error.code === EError.GENERIC_ERROR) {
        console.error(error);
        return res.status(500).send({ mensaje: error.message });
    }
    res.status(500).send({ mensaje: 'Error interno del servidor' });
}

export default errorHandler;