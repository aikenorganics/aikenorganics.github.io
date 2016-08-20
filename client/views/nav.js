import React from 'react'
import Link from './link'
import {navigate, signout} from '../actions'

export default ({currentUser}) => {
  const {isAdmin} = currentUser || {}

  const handleSignout = (event) => {
    event.preventDefault()
    signout().then(() => navigate('/'))
  }

  return <nav className='navbar navbar-inverse navbar-fixed-top'>
    <div className='container'>
      <ul className='nav navbar-nav'>
        <li><Link href='/'>Home</Link></li>
        <li><Link href='/#about'>About</Link></li>
        <li><Link href='/learn'>Learn</Link></li>
        <li><Link href='/products'>Market</Link></li>
        {currentUser ? <li><Link href='/settings'>Settings</Link></li> : null}
        {isAdmin ? <li><Link href='/admin/users'>Admin</Link></li> : null}
        {currentUser ? <li><a id='signout' href='/session' onClick={handleSignout}>Sign Out</a></li> : null}
        {currentUser ? null : <li><Link href='/signin'>Sign In</Link></li>}
        {currentUser ? null : <li><Link href='/signup'>Sign Up</Link></li>}
      </ul>
    </div>
  </nav>
}
