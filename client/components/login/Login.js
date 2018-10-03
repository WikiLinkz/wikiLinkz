import React, { Component } from 'react'
import { googleProvider, auth } from '../../../server/db/config'
import LoginComplete from './LoginComplete'

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      user: null
    }

    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      }
    })
  }

  async login() {
    const res = await auth.signInWithPopup(googleProvider)
    const user = res.user
    this.setState({ user })
  }

  async logout() {
    await auth.signOut()
    this.setState({ user: null })
  }

  render() {
    return (
      <div id="login">
        {
          (this.state.user)
            ? <LoginComplete user={this.state.user} logout={this.logout} />
            : <button type="button" onClick={this.login}>Login With Google</button>
        }
      </div>
    )
  }
}
