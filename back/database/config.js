const mongoose = require('mongoose');

const dbConection = async () => {
    try {
        await mongoose.connect(process.env.DB_CNN, {
            maxPoolSize: 20,
            serverSelectionTimeoutMS: 5000,
        });
        console.log('DB online');
    } catch (error) {
        console.log(error);
        throw new Error('Error al inicializar DB');
    }
};

module.exports = {
    dbConection,
};