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

module.exports = router