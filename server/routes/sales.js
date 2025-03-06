const router = require('express').Router()
const productsModel = require('../models/products')
const salesModel = require('../models/sales')

// 1 product buy
const createNewSaleDocument = (req, res, next) => {
    let saleDetails = {
        paypalPaymentID: req.params.orderID,
        productID: req.params.productId,
        price: req.params.price,
    }

    productsModel.findByIdAndUpdate(req.params.productId, { sold: true }, (err, product) => {
        if (err) {
            return next(err)
        }

        if (!product) {
            return res.status(404).json({ error: "Product not found" })
        }

        salesModel.create(saleDetails, (err, sale) => {
            if (err) {
                return next(err)
            }

            return res.json({ success: true, sale: saleDetails })
        })
    })
}

// mutipleprodu ct buy
const createMultiProductSaleDocument = (req, res, next) => {
    const { orderID, cartItems, totalPrice } = req.body

    cartItems.forEach((item) => {
        const saleDetails = {
            paypalPaymentID: orderID,
            productID: item.productId,
            price: item.price,
            quantity: item.quantity,
        }

        // update product stock and mark as sold
        productsModel.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } }, (err, product) => {
            if (err) {
                return next(err)
            }

            if (!product) {
                console.error(`Product not found: ${item.productId}`)
                return
            }

            salesModel.create(saleDetails, (err, sale) => {
                if (err) {
                    console.error(`Error creating sale record: ${err}`)
                }
            })
        })
    })

    return res.json({ success: true, orderID, totalPrice })
}

router.post('/sales/:orderID/:productId/:price', createNewSaleDocument)
router.post('/sales/checkout', createMultiProductSaleDocument) // mutiple

module.exports = router