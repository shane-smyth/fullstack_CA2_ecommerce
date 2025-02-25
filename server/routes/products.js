const router = require(`express`).Router()
let createError = require("http-errors")

const jwt = require('jsonwebtoken')
const fs = require('fs')
const JWT_PRIVATE_KEY = fs.readFileSync(process.env.JWT_PRIVATE_KEY_FILENAME, 'utf8')
const multer  = require('multer')
let upload = multer({
    limits: { fieldSize: 25 * 1024 * 1024 }, // Increase limit to 25MB
    dest: `${process.env.UPLOADED_FILES_FOLDER}`
})


const productsModel = require(`../models/products`)

const verifyUsersJWTPassword = (req, res, next) => {
    // console.log(req.headers.authorization)
    // console.log(req.headers)
    jwt.verify(req.headers.authorization, JWT_PRIVATE_KEY, {algorithm: "HS256"}, (err, decodeToken) => {
        if (err) {
            return next(err)
        }
        req.decodeToken = decodeToken
        return next()
    })
}

const checkIfAdmin = (req, res, next) => {
    if (req.decodeToken.accessLevel < process.env.ACCESS_LEVEL_ADMIN) {
        return next(createError(401))
    }
    return next()
}

const createNewProduct = (req, res, next) => {
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
            return next(err)
        }
        res.json(data)
    })
}

const getAllProducts = (req, res, next) => {
    productsModel.find((error, data) => {
        if (error) {
            return next(error)
        }
        res.json(data)
    })
}

const getProductsPhotoAsBase64 = (req, res, next) => {
    fs.readFile(`${process.env.UPLOADED_FILES_FOLDER}/${req.params.filename}`, 'base64', (err, data) => {
        if (err) {
            return next(err)
        }
        return res.json({image: data})
    })
}

const getProductDocument = (req, res, next) => {
    productsModel.findById(req.params.id, (error,data) => {
        if (error) {
            return next(error)
        }
        res.json(data)
    })
}

const updateProduct = (req, res, next) => {
    productsModel.findById(req.params.id, (error, existingProduct) => {
        if (error || !existingProduct) {
            return res.status(404).json({ errorMessage: "Product not found" });
        }

        let updatedImages = [...existingProduct.images];

        if (req.files.length > 0) {
            updatedImages = [...updatedImages, ...req.files.map(file => ({ filename: file.filename }))];
        }

        // Remove images that were deleted by the user
        if (req.body.removedImages) {
            const removedImages = JSON.parse(req.body.removedImages);
            updatedImages = updatedImages.filter(img => !removedImages.includes(img.filename));

            // Delete the removed images from the server folder
            removedImages.forEach(filename => {
                const filePath = `${process.env.UPLOADED_FILES_FOLDER}/${filename}`;
                fs.unlink(filePath, (err) => {
                    if (err) console.error(`Error deleting file: ${filePath}`, err);
                });
            });
        }

        let productDetails = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            rating: req.body.rating,
            category: req.body.category,
            subcategory: req.body.subcategory,
            brand: req.body.brand,
            stock: req.body.stock,
            images: updatedImages,
            specifications: req.body.specifications || [],
        };

        productsModel.findOneAndUpdate({ _id: req.params.id }, productDetails, { new: true }, (error, data) => {
            if (error) {
                return next(error);
            }
            res.json(data);
        });
    });
};


const deleteProduct = (req, res, next) => {
    const productId = req.params.id
    productsModel.findByIdAndDelete(productId, (error, data) => {
        if (error || !data) {
            return next(error)
        }
        res.json({data})
    })
}

// read all records
router.get(`/products`, getAllProducts)

// get one product photo
router.get(`/products/photo/:filename`, getProductsPhotoAsBase64)

// read one record
router.get(`/products/:id`, getProductDocument)

// add new record
router.post(`/products/newProduct`, verifyUsersJWTPassword, checkIfAdmin, upload.array("images", parseInt(process.env.MAX_NUMBER_OF_UPLOAD_FILES_ALLOWED)), createNewProduct)

// update one record
router.put(`/products/edit/:id`, verifyUsersJWTPassword, checkIfAdmin, upload.array("images", parseInt(process.env.MAX_NUMBER_OF_UPLOAD_FILES_ALLOWED)), updateProduct)

// delete one record
router.delete(`/products/delete/:id`, verifyUsersJWTPassword, checkIfAdmin, deleteProduct)

module.exports = router
