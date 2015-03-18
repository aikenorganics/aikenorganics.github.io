var express = require('express')
var find = require('../mid/find')
var models = require('../models')
var router = module.exports = express.Router()

// Find
router.param('product_id', find(models.Product, {
  include: [
    {model: models.Grower, as: 'grower'},
    {model: models.Category, as: 'category'}
  ]
}))

// Authorize
router.param('product_id', require('../mid/products/authorize'))

// Index
router.get('/', function (req, res) {
  var category_id = req.query.category_id

  Promise.all([
    models.Category.findAll({order: [['position', 'ASC']]}),
    models.Product.findAll({
      order: [['name', 'ASC']],
      where: category_id ? {category_id: category_id} : {},
      include: [{model: models.Grower, as: 'grower'}]
    })
  ]).then(function (results) {
    res.render('products/index', {
      categories: results[0],
      products: results[1]
    })
  })
})

// Show
router.get('/:product_id', function (req, res) {
  res.render('products/show')
})

// Edit
router.get('/:product_id/edit', editProduct)

function editProduct (req, res) {
  if (!req.canEdit) return res.status(401).render('401')

  models.Category.findAll({
    order: [['position', 'ASC']]
  }).then(function (categories) {
    res.render('products/edit', {categories: categories})
  })
}

// Update

router.post('/:product_id', function (req, res) {
  if (!req.canEdit) return res.status(401).render('401')

  req.transaction(function (transaction) {
    return req.product.update(req.body, {
      transaction: transaction,
      fields: ['name', 'cost', 'supply', 'unit', 'description', 'category_id']
    }).then(function () {
      res.flash('success', 'Saved')
      res.redirect('/products/' + req.product.id)
    }).catch(function (error) {
      res.status(422)
      res.locals.error = error
      editProduct(req, res)
    })
  })
})

// Image

router.post('/:product_id/image', function (req, res, next) {
  if (!req.canEdit) return res.status(401).render('401')
  next()
}, require('../mid/image-upload')('product'))
