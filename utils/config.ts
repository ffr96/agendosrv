import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const SECRT = process.env.CODE;

module.exports = {
    PORT,
    MONGODB_URI,
    SECRT
};