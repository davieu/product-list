const router = require('express').Router();
const faker = require('faker');
const Product = require('../models/product');

router.get('/generate-fake-data', (req, res, next) => {
  for (let i = 0; i < 90; i++) {
    let product = new Product();

    product.category = faker.commerce.department();
    product.name = faker.commerce.productName();
    product.price = faker.commerce.price();
    product.image = 'https://www.oysterdiving.com/components/com_easyblog/themes/wireframe/images/placeholder-image.png'

    product.save((err) => {
      if (err) throw err
    })
  }
  res.end();
});

router.get('/products', (req, res, next) => {
    const perPage = 9
  
    // return the first page by default
    const page = req.query.page || 1
  
    Product
      .find({})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec((err, products) => {
        Product.count().exec((err, count) => {
          if (err) return next(err)
  
          res.send(products);
        })
      })
});

//Returns a specific product by it's id
router.get('/products/:products', (req, res, next) => {

});

//Returns ALL the reviews, but limited to 40 at a time
router.get('/reviews', (req, res, next) => {

});

//Creates a new product in the database
router.post('/products', (req, res, next) => {

});

//Creates a new review in the database by adding it to the 
//correct product's reviews array
router.post('/:product/reviews', (req, res, next) => {

});

//Deletes a product by id
router.delete('/products/:product', (req, res, next) => {

});

//Deletes a review by id
router.delete('/reviews/:review', (req, res, next) => {

});

module.exports = router;