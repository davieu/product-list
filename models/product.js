const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({ 
    userName: String,
    reviewText: String,
    product:{ type: Schema.Types.ObjectId, ref: 'Product' }
});

const productSchema = new Schema({
    category: String,
    name: String,
    price: Number,
    image: String,
    reviews: [reviewSchema]
});


module.exports = { 
    Product: mongoose.model("Product", productSchema),
    Review: mongoose.model("Review", reviewSchema)
};
