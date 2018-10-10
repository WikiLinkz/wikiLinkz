import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class LoginComplete extends Component {
  render() {
    const { logout, userName } = this.props
    return (
      <div id="user-home">
        <div id="user-info">
          <h3>{userName}</h3>
          <Link to='/stats'>
            <img src='/stats.png' width='40px' />
          </Link>
          <a href='#' onClick={logout}>Logout</a>
        </div>
      </div>
    )
  }
}
