const {Schema, model} = require('mongoose');

const ColaboradorSchema = Schema({

    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: true
    },
    userLevel: {
        type: String,
        required: true
    },
    registerBy: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    }
});

module.exports = model('Colaborador', ColaboradorSchema);
