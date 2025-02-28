const mongoose = require('mongoose')

let usersSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    accessLevel: {
        type: Number,
        default: parseInt(process.env.ACCESS_LEVEL_NORMAL_USER),
    },
    pfp: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/747/747376.png",
    }}, {
    collection: `users`,
})

module.exports = mongoose.model(`users`, usersSchema)