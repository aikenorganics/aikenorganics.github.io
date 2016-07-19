'use strict'

const user = require('../../users/user')

exports.edit = (set, {_user}) => {
  set('user', _user)
}

exports.emails = (set, {users}) => {
  set('emails', users.map((user) => user.email))
}

exports.index = (set, {page, users}) => {
  set({page})
  set(users, 'more')
  set('users', users, user)
}

exports.new = (set) => {}
