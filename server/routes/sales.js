const router = require('express').Router()
const productsModel = require('../models/products')
const salesModel = require('../models/sales')
// const usersModel = require('../models/users')
// let createError = require("http-errors")
const mongoose = require('mongoose')

const jwt = require('jsonwebtoken')
const fs = require('fs')
const JWT_PRIVATE_KEY = fs.readFileSync(process.env.JWT_PRIVATE_KEY_FILENAME, 'utf8')

// 1 product buy
const createNewSaleDocument = (req, res, next) => {
    console.log( req.body)

    const { orderID, productId, price, quantity, userID, guestInfo } = req.body
    console.log("received guestInfo: ", guestInfo)

    let saleDetails = {
        paypalPaymentID: orderID,
        productID: productId,
        price: price,
        quantity: quantity,
    }

    if (userID) {
        saleDetails.userID = userID
    }
    else {
        saleDetails.userID = null

        if (guestInfo) {
            saleDetails.guestInfo = {
                name: guestInfo.name,
                address: guestInfo.address,
                phone: guestInfo.phone,
                email: guestInfo.email,
            }
            console.log("sale details before log:", saleDetails)
        }
    }

    productsModel.findByIdAndUpdate(productId, { $inc: { stock: -quantity } }, (err, product) => {
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

            console.log("sale saved in database:", sale)
            return res.json({ success: true, sale: saleDetails })
        })
    })
}

// mutipleprodu ct buy
const createMultiProductSaleDocument = (req, res, next) => {
    const { orderID, cartItems, totalPrice, userID, guestInfo } = req.body

    cartItems.forEach((item) => {
        const saleDetails = {
            paypalPaymentID: orderID,
            productID: item.productId,
            price: item.price,
            quantity: item.quantity,
        }

        if (userID) {
            saleDetails.userID = userID
        } else if (guestInfo) {
            saleDetails.guestInfo = {
                name: guestInfo.name,
                address: guestInfo.address,
                phone: guestInfo.phone,
                email: guestInfo.email,
            }
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


const verifyUsersJWTPassword = (req, res, next) => {
    jwt.verify(req.headers.authorization, JWT_PRIVATE_KEY, { algorithm: "HS256" }, (err, decodeToken) => {
        if (err) {
            return next(err)
        }
        req.decodeToken = decodeToken
        return next()
    })
}

// const checkIfAdmin = (req, res, next) => {
//     if (req.decodeToken.accessLevel < process.env.ACCESS_LEVEL_ADMIN) {
//         return next(createError(401))
//     }
//     return next()
// }
//c check if admin
router.get('/sales', verifyUsersJWTPassword, (req, res, next) => {
    console.log("decoded token user id:", req.decodeToken.userID)
    if (req.decodeToken.accessLevel >= process.env.ACCESS_LEVEL_ADMIN) {
        salesModel.find()
            .populate('userID', 'username email')
            .then((sales) => {
                console.log("Admin all sales:", sales)
                res.json(sales)
            })
            .catch((err) => next(err))
    }
    else {
        const userID = mongoose.Types.ObjectId(req.decodeToken.userID)
        salesModel.find({ userID: userID })
            .populate('userID', 'username email')
            .then((sales) => {
                console.log("User sales:", sales)
                res.json(sales)
            })
            .catch((err) => next(err))
    }
})

router.put('/sales/:saleId/return', verifyUsersJWTPassword, (req, res, next) => {
    const { saleId } = req.params

    salesModel.findByIdAndUpdate(saleId, { returned: true }, { new: true }, (err, sale) => {
        if (err) {
            return next(err)
        }
        if (!sale) {
            return res.status(404).json({ error: "Sale not found" })
        }
        res.json({ success: true, sale })
    })
})

module.exports = router