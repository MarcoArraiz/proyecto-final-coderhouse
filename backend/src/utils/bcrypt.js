import bcrypt from 'bcrypt';

export const hashPassword = async (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const validatePassword = async (password, hash) => bcrypt.compareSync(password, hash);