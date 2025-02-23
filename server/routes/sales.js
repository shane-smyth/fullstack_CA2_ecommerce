const router = require('express').Router()

const productsModel = require('../models/products')
const salesModel = require('../models/sales')

const createNewSaleDocument = (req, res, next) => {
    // Use the PayPal details to create a new sale document
    let saleDetails = {
        paypalPaymentID: req.params.orderID,
        productID: req.params.productId,
        price: req.params.price
    }  

    productsModel.findByIdAndUpdate(req.params.productId, { sold: true }, (err, product) => {
        if (err) {
            return next(err)
        }

        if (!product) {
            return res.status(404).json({error: "Product not found"})
        }

        salesModel.create(saleDetails, (err, sale) => {
            if (err) {
                return next(err)
            }

        return res.json({success: true, sale: saleDetails})
        })
    })  
}  

// Save a record of each PayPal payment
router.post('/sales/:orderID/:productId/:price', createNewSaleDocument)

module.exports = router