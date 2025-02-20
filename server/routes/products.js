const router = require(`express`).Router()
const jwt = require('jsonwebtoken')
const fs = require('fs')
const JWT_PRIVATE_KEY = fs.readFileSync(process.env.JWT_PRIVATE_KEY_FILENAME, 'utf8')
const multer  = require('multer')
let upload = multer({dest: `${process.env.UPLOADED_FILES_FOLDER}`})

const productsModel = require(`../models/products`)

// read all records
router.get(`/products`, (req, res) => {
    productsModel.find((error, data) => {
        res.json(data)
    })
})

router.get(`/products/photo/:filename`, (req, res) => {
    fs.readFile(`${process.env.UPLOADED_FILES_FOLDER}/${req.params.filename}`, 'base64', (err, fileData) => {
        if (fileData) {
            res.json({ image: fileData });
        } else {
            res.json({ image: null });
        }
    });
});

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
router.post(`/products/newProduct`, upload.array("images", parseInt(process.env.MAX_NUMBER_OF_UPLOAD_FILES_ALLOWED)), (req, res) => {
    jwt.verify(req.headers.authorization, JWT_PRIVATE_KEY, {algorithm: "HS256"}, (err, decodeToken) => {
        if (err) {
            res.json({errorMessage: "User is not logged in"})
        }
        else {
            if (decodeToken.accessLevel >= process.env.ACCESS_LEVEL_ADMIN) {
                let productDetails = {
                    name: req.body.name,
                    description: req.body.description,
                    price: req.body.price,
                    rating: req.body.rating,
                    category: req.body.category,
                    subcategory: req.body.subcategory,
                    brand: req.body.brand,
                    stock: req.body.stock,
                    images: req.files.map(file => ({ filename: file.filename })),
                    specifications: req.body.specifications || [],
                }

                // console.log(productDetails)
                productsModel.create(productDetails, (err, data) => {
                    if (err) {
                        console.log("Error adding product:", err)
                        return res.json({ errorMessage: "Database error" })
                    }
                    res.json(data)
                })
            }
        }
    })
})



// edit product
router.put(`/products/edit/:id`, (req, res) => {
    jwt.verify(req.headers.authorization, JWT_PRIVATE_KEY, {algorithm: "HS256"}, (err, decodeToken) => {
        if (err) {
            res.json({errorMessage: "user not logged in"})
        }
        else {
            console.log(req.body) //https://stackoverflow.com/questions/57176075/findbyidandupdate-not-working-when-there-is-addition-of-records-in-collection
            productsModel.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, {new: true}, (error, data) => {
                res.json(data)
            })
        }
    })
})


// delete product
router.delete(`/products/delete/:id`, (req, res) => {
    const productId = req.params.id
    productsModel.findByIdAndDelete(productId, (error, data) => {
        if (error || !data) {
            res.json({errorMessage: "Product not found"})
        }
        res.json({data})
    })
})


module.exports = router
