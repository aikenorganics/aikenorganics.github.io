'use strict'

const db = require('../db')
const json = require('../json/products')
const router = module.exports = require('ozymandias').Router()

// Find
router.find('product', () => db.Product.include('grower', 'category'))

// Authorize
router.param('productId', (req, res, next) => {
  if (!req.currentUser || !req.product) return next()
  db.UserGrower.where({
    userId: req.currentUser.id,
    growerId: req.product.growerId
  }).find().then((userGrower) => {
    req.canEdit = res.locals.canEdit = req.admin || !!userGrower
    next()
  }).catch(res.error)
})

// Index
router.get('/', (req, res) => {
  let products = db.Product
    .include('grower').join('grower')
    .where({active: true, grower: {active: true}})

  // Search
  const {search} = req.query
  if (search) products.search(search)

  // Category
  const {categoryId} = req.query
  if (categoryId) products = products.where({categoryId})

  // Grower
  if (req.query.growerId) {
    products = products.where({growerId: req.query.growerId})
  }

  // Pagination
  const page = res.locals.page = +(req.query.page || 1)

  Promise.all([
    products.order('name').paginate(page, 30),
    db.Category.where(`exists(
      select 1 from products
      inner join growers on growers.id = products.grower_id
      where category_id = categories.id and products.active and growers.active
    )`).order('position').all()
  ]).then(([products, categories]) => {
    res.react(json.index, {categories, categoryId, page, products, search})
  }).catch(res.error)
})

// Show
router.get('/:productId', (req, res) => {
  res.react(json.show, {product: req.product})
})

// Edit
router.get('/:productId/edit', (req, res) => {
  if (!req.canEdit) return res.unauthorized()

  db.Category.order('position').all().then((categories) => {
    res.react(json.edit, {categories, product: req.product})
  }).catch(res.error)
})

// Update
router.post('/:productId', (req, res) => {
  if (!req.canEdit) return res.unauthorized()

  const values = req.permit(
    'active',
    'categoryId',
    'cost',
    'description',
    'name',
    'supply',
    'unit'
  )

  if (req.admin) {
    Object.assign(values, req.permit('featured'))
  }

  req.product.update(values).then(() => {
    res.json(json.update)
  }).catch(res.error)
})

// Image
router.post('/:productId/image', (req, res) => {
  if (!req.canEdit) return res.unauthorized()
  req.product.uploadImage(req).then(() => {
    res.json(json.image)
  }).catch(res.error)
})
