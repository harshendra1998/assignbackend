const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
    },
    senderemail: {
        type: String,
        require: true,
    },
    comment: {
        type: String,
    }
})

module.exports = mongoose.model('Comments', dataSchema)