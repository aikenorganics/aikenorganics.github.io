import React from 'react'
import Router, {Route} from './router'

import App from './views/app'
import Admin from './views/admin/app'

import Product from './views/products/show'
import Products from './views/products/index'
import EditProduct from './views/products/edit'

import Grower from './views/growers/show'
import Growers from './views/growers/index'
import EditGrower from './views/growers/edit'
import GrowerProducts from './views/growers/products'

import Locations from './views/admin/locations/index'
import EditLocation from './views/admin/locations/edit'
import NewLocation from './views/admin/locations/new'

import Emails from './views/admin/users/emails'
import Users from './views/admin/users/index'
import EditUser from './views/admin/users/edit'

export default (state) => {
  return <Router state={state}>
    <Route path='/admin/' Component={Admin}>
      <Route path='locations' Component={Locations}/>
      <Route path='locations/:location_id/edit' Component={EditLocation}/>
      <Route path='locations/new' Component={NewLocation}/>
      <Route path='users' Component={Users}/>
      <Route path='users/emails' Component={Emails}/>
      <Route path='users/:user_id/edit' Component={EditUser}/>
    </Route>
    <Route path='/' Component={App}>
      <Route path='growers' Component={Growers}/>
      <Route path='growers/:grower_id' Component={Grower}/>
      <Route path='growers/:grower_id/edit' Component={EditGrower}/>
      <Route path='growers/:grower_id/products' Component={GrowerProducts}/>
      <Route path='products' Component={Products}/>
      <Route path='products/:product_id' Component={Product}/>
      <Route path='products/:product_id/edit' Component={EditProduct}/>
    </Route>
  </Router>
}
