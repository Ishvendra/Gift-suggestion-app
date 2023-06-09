const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id:{
        type: Number
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
    },
    discountPercentage: {
        type: Number,
    },
    rating: {
        type: Number,
    },
    stock: {
        type: Number,
    },
    brand: {
        type: String,
    },
    category: {
        type: String,
    },
    thumbnail: {
        type: String,
    },
    images: {
        type: Array,
    },
    gender: {
        type: String,
    },
    age: {
        type: Number,
    },
    cart: {
        type: Boolean
    }
})
var productModel = mongoose.model('products',productSchema);

module.exports = productModel;