var test = require('../test')
var models = require('../../models')

// Index

test('GET /products is a 200 as an admin', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent
    .get('/products')
    .expect(200)
    .end(t.end)
  })
})

test('GET /products is a 200 as a non-admin', function (t) {
  t.signIn('user@example.com').then(function (agent) {
    agent
    .get('/products')
    .expect(200)
    .end(t.end)
  })
})

test('GET /products is a 200 as an authorized user', function (t) {
  t.signIn('grower@example.com').then(function (agent) {
    agent
    .get('/products')
    .expect(200)
    .end(t.end)
  })
})

test('GET /products is a 200 signed out', function (t) {
  t.request()
  .get('/products')
  .expect(200)
  .end(t.end)
})

test('GET /products?category_id=:id is a 200', function (t) {
  t.request()
  .get('/products?category_id=1')
  .expect(200)
  .end(t.end)
})

// Show

test('GET /products/:id is a 200 as an admin', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent
    .get('/products/1')
    .expect(200)
    .end(t.end)
  })
})

test('GET /products/:id is a 200 as a non-admin', function (t) {
  t.signIn('user@example.com').then(function (agent) {
    agent
    .get('/products/1')
    .expect(200)
    .end(t.end)
  })
})

test('GET /products/:id is a 200 as an authorized user', function (t) {
  t.signIn('grower@example.com').then(function (agent) {
    agent
    .get('/products/1')
    .expect(200)
    .end(t.end)
  })
})

test('GET /products/:id is a 200 signed out', function (t) {
  t.request()
  .get('/products/1')
  .expect(200)
  .end(t.end)
})

// Edit

test('GET /products/edit is a 401 signed out', function (t) {
  t.request().get('/products/1/edit')
  .expect(401)
  .end(t.end)
})

test('GET /products/edit is a 401 as a non-admin', function (t) {
  t.signIn('user@example.com').then(function (agent) {
    agent.get('/products/1/edit')
    .expect(401)
    .end(t.end)
  })
})

test('GET /products/edit is a 200 as an authorized user', function (t) {
  t.signIn('grower@example.com').then(function (agent) {
    agent.get('/products/1/edit')
    .expect(200)
    .end(t.end)
  })
})

test('GET /products/edit is a 200 as an admin', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent.get('/products/1/edit')
    .expect(200)
    .end(t.end)
  })
})

// Update

test('POST /products/:id is a 302 as an admin', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent.post('/products/1')
    .field('name', 'Peaches')
    .expect(302)
    .end(t.end)
  })
})

test('POST /products/:id is a 302 as an authorized user', function (t) {
  t.signIn('grower@example.com').then(function (agent) {
    agent.post('/products/1')
    .field('name', 'Peaches')
    .expect(302)
    .end(t.end)
  })
})

test('POST /products/:id is a 401 as a non-admin', function (t) {
  t.signIn('user@example.com').then(function (agent) {
    agent.post('/products/1')
    .field('name', 'Peaches')
    .expect(401)
    .end(t.end)
  })
})

test('POST /products/:id is a 422 for invalid data', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent.post('/products/1')
    .field('name', '')
    .field('cost', 'asdf')
    .field('supply', -23)
    .field('category_id', 1)
    .expect(422)
    .end(t.end)
  })
})

// Image

test('POST /products/:id/image is a 401 as a non-admin', function (t) {
  t.signIn('user@example.com').then(function (agent) {
    agent.post('/products/1')
    .expect(401)
    .end(t.end)
  })
})

test('GET /products has no inactive products', function (t) {
  t.request()
  .get('/products')
  .expect(200)
  .expect(function (res) {
    if (~res.text.indexOf('/products/6')) {
      return 'should not see inactive growers'
    }
    if (~res.text.indexOf('/products/7')) {
      return 'should not see inactive products'
    }
  })
  .end(t.end)
})

test('POST /products/:id activates products', function (t) {
  t.signIn('grower@example.com').then(function (agent) {
    agent.post('/products/1')
    .field('active', '0')
    .expect(302)
    .end(function (e) {
      if (e) return t.end()
      models.Product.findOne({
        where: {id: 1},
        transaction: t.transaction
      }).then(function (product) {
        t.equal(product.active, false)
        t.end()
      })
    })
  })
})

test('POST /products/:id deactivates products', function (t) {
  t.signIn('admin@example.com').then(function (agent) {
    agent.post('/products/7')
    .field('active', '1')
    .expect(302)
    .end(function (e) {
      if (e) return t.end()
      models.Product.findOne({
        where: {id: 7},
        transaction: t.transaction
      }).then(function (product) {
        t.equal(product.active, true)
        t.end()
      })
    })
  })
})
