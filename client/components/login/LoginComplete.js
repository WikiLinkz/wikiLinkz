import React, { Component } from 'react'

export default class LoginComplete extends Component {
  render() {
    const { logout } = this.props
    const { displayName, email } = this.props.user
    return (
      <div id="user-home">
        {
          (displayName)
            ? <h3>Welcome, {displayName}</h3>
            : <h3>Welcome, {email}</h3>
        }
        <button type="button" onClick={logout}>Logout</button>
      </div>
    )
  }
}
