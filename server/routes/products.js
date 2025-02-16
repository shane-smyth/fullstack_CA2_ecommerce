const router = require(`express`).Router()

const productsModel = require(`../models/products`)

// read all records
router.get(`/products`, (req, res) => {
    productsModel.find((error, data) => {
        res.json(data)
    })
})


// read one record
router.get(`/products/:id`, (req, res) => {
    productsModel.findById(req.params.id, (error,data) => {
        res.json(data)
    })
})


// read the brand of the products
router.get(`/brands`, (req, res) => {
    productsModel.distinct("brand", (error, data) => {
        if (error) {
            res.json({error: "Error fetching brands"})
        }
        else {
            res.json(data)
        }
    })
})


// add new product
router.post(`/products/newProduct`, (req, res) => {
    const {name, description, price, images, rating, category, subcategory, brand, stock, specifications} = req.body
    if (!name || name.length < 3 || name.length > 100) {
        res.json({errorMessage: `Product name must be between 3 & 100 in lenght`})
    }
    else if (!description || description.length < 10) {
        res.json({errorMessage: `Product description must be at least 10 characters in lenght`})
    }
    else if (!price || price < 0) {
        res.json({errorMessage: `Price cannot be a negative number`})
    }
    else if (!Array.isArray(images)) {
        res.json({errorMessage: `Images must be an array and have a valid image url`})
    }
    else if (!rating !== undefined && (rating < 0 || rating > 5)) {
        res.json({errorMessage: `Rating must be between 0 - 5`})
    }
    else if (!String) {
        res.json({errorMessage: `Invalid category`})
    }
    else if (!String) {
        res.json({errorMessage: `Invalid subcategory`})
    }
    else if (!brand || brand.trim() === "") {
        res.json({errorMessage: `Brand is required and must be a string`})
    }
    else if (!stock || stock < 0) {
        res.json({errorMessage: `Stock cannot be a negative number`})
    }
    else if (!Array.isArray(specifications) || !specifications.every(spec => spec.key && spec.value)) {
        res.json({errorMessage: `specifications must be an array of keys and values`})
    }
    else {
        productsModel.create(req.body, (error, data) => {
            res.json(data)
        })
    }
})

module.exports = router
