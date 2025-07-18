const CryptoJS = require('crypto-js');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const claveSecreta = process.env.CLAVE_SECRETA || 'default_secret_key_for_bike_rental';
const SALT_ROUNDS = 10;

const cifrarDatos = (datos) => {
    try {
        if (!datos) return null;
        return CryptoJS.AES.encrypt(datos.toString(), claveSecreta).toString();
    } catch (error) {
        console.error('Error al cifrar datos:', error);
        throw new Error('Error al cifrar información sensible');
    }
};

const descifrarDatos = (cifrado) => {
    try {
        if (!cifrado) return null;
        const bytes = CryptoJS.AES.decrypt(cifrado, claveSecreta);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('Error al descifrar datos:', error);
        throw new Error('Error al descifrar información sensible');
    }
};

const hashPassword = async (password) => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};

const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

module.exports = {
    cifrarDatos,
    descifrarDatos,
    hashPassword,
    comparePassword
};