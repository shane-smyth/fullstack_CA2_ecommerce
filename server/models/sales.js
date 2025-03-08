const mongoose = require('mongoose')

let salesSchema = new mongoose.Schema({
    paypalPaymentID: { type: String, required: true },
    productID: { type: String, required: true },
    // userID: { type: String, ref: userID, required: true },
    price: { type: Number, required: true }
    // quantity
}, {
    collection: 'sales'
})

module.exports = mongoose.model('sales', salesSchema)