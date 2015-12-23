import page from 'page'
import React from 'react'
import {render} from 'react-dom'
import Products from '../views/growers/products'

function data (id) {
  let el = document.getElementById(id)
  return el ? JSON.parse(el.innerHTML) : null
}

let cart = data('cart')
let user = data('user')
let market = data('market')
let content = document.getElementById('content')

page('/growers/:id/products', (c) => {
  let props = {
    cart: cart,
    user: user,
    open: market.open,
    grower: data('grower'),
    products: data('products')
  }
  render(<Products {...props}/>, content)
})

page({click: false, popstate: false})
