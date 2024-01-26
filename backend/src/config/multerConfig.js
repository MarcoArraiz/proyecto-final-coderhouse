// multerConfig.js
import multer from 'multer';
import { __dirname } from '../path.js';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (_, file, cb) {
        let folder = '';
        if (file.fieldname === 'profileImage') {
            folder = 'profiles';
        } else if (file.fieldname === 'productImage') {
            folder = 'products';
        } else if (file.fieldname === 'document') {
            folder = 'documents';
        } else {
            folder = 'others';
        }
        cb(null, path.join(__dirname, `/uploads/${folder}`));
    },
    filename: function (_, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

export default upload;
