const mongoose = require(`mongoose`)

// https://mongoosejs.com/docs/schematypes.html
let productsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
        minlength: [3, "Product name must be at least 3 characters"],
        maxlength: [100, "Product name must be less than 100"],
    },
    description: {
        type: String,
        required: [true, "Product description is required"],
        trim: true,
        minlength: [10, "Product description must be at least 10 characters"],
    },
    price: {
        type: Number,
        required: [true, "Product price is required"],
        min: [0, "Price cannot be negative"],
    },
    images: {
        type: [String],
        required: true,
        match: /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i //https://stackoverflow.com/questions/4098415/use-regex-to-get-image-url-in-html-js
    },
    rating: {
        type: Number,
        min: [0, "Rating cannot be less than 0"],
        max: [5, "Rating cannot be more than 5"],
        default: 0
    },
    category: {
        type: [String],
        required: [true, "at least one category is required"],
        enum: {
            values: ["Guitar", "Drums & Percussion", "Keyboards & Pianos", "Bass", "Amplifiers", "Synthesizers"],
            message: "Invalid category"
        }
    },
    subcategory: {
        type: [String],
        required: [true, "Subcategory is required"],
        enum: {
            values: ["Electric Guitar", "Acoustic Guitar", "Digital Pianos", "Acoustic Drum Kits", "Guitar Amplifiers", "Analog Synthesizers", "Cymbals", "Acoustic-Electric Guitars", "Stage Pianos", "Electric Bass Guitar", ],
            message: "Invalid subcategory"
        }
    },
    brand: {
        type: String,
        required: true,
        trim: true,
    },
    stock: {
        type: Number,
        required: [true, "Stock is required"],
        min: [0, "Stock cannot be negative"],
    },
    specifications: [{key: String, value: String}]
}, {
    collection: `products`,
})

module.exports = mongoose.model(`products`, productsSchema)