// src/utils/cryptoUtils.js
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'test@123'; //Must match backend!

/**
 * Encrypts an object/string into a base64 string
 * @param {Object|string} data - The data to encrypt
 * @returns {string} - Encrypted string
 */
export const encryptData = (data) => {
  try {
    const jsonString = typeof data === 'string' ? data : JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
    return encrypted;
  } catch (err) {
    console.error('Encryption failed:', err);
    return '';
  }
};

/**
 * Decrypts a string (for testing or if backend sends encrypted data)
 * @param {string} encryptedData
 * @returns {Object|null}
 */
export const decryptData = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (err) {
    console.error('Decryption failed:', err);
    return null;
  }
};