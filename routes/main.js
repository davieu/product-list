const router = require('express').Router();
const faker = require('faker');
const { Product, Review } = require('../models/product');

//generates fake data products
router.get('/generate-fake-data', (req, res, next) => {
    for (let i = 0; i < 90; i++) {
        let product = new Product()
    
        product.category = faker.commerce.department()
        product.name = faker.commerce.productName()
        product.price = faker.commerce.price()
        product.image = faker.image.image()
        product.reviews = []
        product.save((err, product) => {
            if (err) throw err
        })
        //generates reviews with the products. Helps for testing
        let review = new Review()
    
        review.userName = faker.internet.userName();
        review.reviewText = faker.lorem.words();
        review.product = product._id;
        product.reviews.push(review)
        review.save((err, product) => {
            if (err) throw err
          })
    }
    res.end()
});

// finds products and you can use this to look through the pagination- ie: /products?page=3
router.get('/products', (req, res, next) => {
    const ProductsPerPage = 9
  
    // return the first page by default
    const page = req.query.page || 1
  
    Product
      .find({})
      .skip((ProductsPerPage * page) - ProductsPerPage)
      .limit(ProductsPerPage)
      .exec((err, products) => {
        Product.count().exec((err, count) => {
          if (err) return next(err)
  
          res.send(products);
        })
      })
});

//Returns a specific product by it's id
router.get('/products/:product', (req, res, next) => {
    Product.findById({_id: req.params.product}).
    exec((error, product) => {
        res.send(product)
    })
});

//Returns ALL the reviews, but limited to 40 at a time
///change pages by ex: reviews?page=3   
router.get('/reviews', (req, res, next) => {
    let skipProducts = 0;
    let reviewsPerPage = 40;

    if (req.query.page && req.query.page > 0) {
        skipProducts = (req.query.page -1)* 40;
        }
    Product.find({})
    .select('reviews')
    .limit(reviewsPerPage)
    .skip(skipProducts)
    .exec((error, reviews) => {
        res.send(reviews)
    })
});

//Creates a new product in the database
//makes a fake single post
router.post('/products', (req, res, next) => {
    let product = new Product();

    product.category = faker.commerce.department();
    product.name = faker.commerce.productName();
    product.price = faker.commerce.price();
    product.image = faker.image.image();
    product.reviews = [];
    product.save((err) => {
        if (err) throw err
      })
    res.send(product)
});

//Creates a new review in the database by adding 
//it to the correct product's reviews array
router.post('/:product/reviews', (req, res, next) => {
    Product.findOne({_id: req.params.product}).
        exec((error, product) => {
            let review = new Review()

            review.userName = faker.internet.userName();
            review.reviewText = faker.lorem.words();
            review.product = product._id;

            product.reviews.push(review).isNew
            product.save((err) => {
                if (err) throw err
              })
            res.send(product)
          })
    })

//Deletes a product by id
router.delete('/products/:product', (req, res, next) => {
    Product.findByIdAndRemove({_id: req.params.product}, (err, products) => {
        if (err) throw err;
        res.send(products)
    })
});

//Deletes a review by id
router.delete('/reviews/:review', (req, res, next) => {
    Product.findOne({ "reviews._id": req.params.review})
    .exec((error, product) => {
        product.reviews.id(req.params.review).remove();
        product.save(function (err) {
            if (err) return handleError(err);
        });
        res.send(product)
    })
})

module.exports = router;