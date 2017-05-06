'use strict'

const test = require('../test')

test('GET /settings is a 401 when logged out', async ({assert}) => {
  const response = await assert.client.get('/settings').send()
  response.assert(401)
})

test('POST /settings is a 401 when logged out', async ({assert}) => {
  const response = await assert.client.post('/settings').send()
  response.assert(401)
})

test('POST /settings/card is a 401 when logged out', async ({assert}) => {
  const response = await assert.client.post('/settings/card').send()
  response.assert(401)
})

test('GET /settings is a 200 as an admin', async ({assert}) => {
  await assert.signIn('admin@example.com')
  const response = await assert.client.get('/settings').send()
  response.assert(200)
})

test('GET /settings is a 200 as a regular user', async ({assert}) => {
  await assert.signIn('user@example.com')
  const response = await assert.client.get('/settings').send()
  response.assert(200)
})

test('POST /settings is a 200 as a regular user', async ({assert}) => {
  await assert.signIn('user@example.com')
  const response = await assert.client
    .post('/settings')
    .set('content-type', 'application/json')
    .set('accept', 'application/json')
    .send({
      first: 'First',
      last: 'Last',
      phone: '555-555-5555'
    })
  response.assert(200).assert('content-type', /json/)
})

test('GET /settings adds stripe to the csp', async ({assert}) => {
  await assert.signIn('user@example.com')
  const response = await assert.client.get('/settings').send()
  response
  .assert(200)
  .assert('content-security-policy', /img-src[^;]+https:\/\/q.stripe.com/)
  .assert('content-security-policy', /frame-src[^;]+https:\/\/checkout.stripe.com/)
  .assert('content-security-policy', /script-src[^;]+https:\/\/checkout.stripe.com/)
  .assert('content-security-policy', /connect-src[^;]+https:\/\/checkout.stripe.com/)
})

test('GET /settings only adds csp to HTML responses', async ({assert}) => {
  await assert.signIn('user@example.com')
  const response = await assert.client.get('/settings').accept('json').send()
  assert.ok(!/stripe/.test(response.headers['content-security-policy']))
})
