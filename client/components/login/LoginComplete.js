import React, { Component } from 'react'

export default class LoginComplete extends Component {
  render() {
    const { logout, userName } = this.props
    return (
      <div id="user-home">
        <h3>Welcome, {userName}</h3>
        <button type="button" onClick={logout}>Logout</button>
      </div>
    )
  }
}
