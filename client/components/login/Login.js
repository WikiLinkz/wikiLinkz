import React, { Component } from 'react'
import { googleProvider, auth, db } from '../../../server/db/config'
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
    try {
      const res = await auth.signInWithPopup(googleProvider)
      const user = res.user
      const usersRef = db.ref("/Users")
      const uid = user.uid
      db.ref("/Users").child(uid).once("value", function (snapshot) {
        if (snapshot.val() === null) {
          usersRef.child(uid).set({
            userId: uid,
            email: user.email
          })
        }
      });
      this.setState({ user })
    } catch (err) {
      console.log('Error logging in', err)
    }
  }

  async logout() {
    await auth.signOut()
    this.setState({ user: null })
  }

  render() {
    return (
      <div id="login" >
        {
          (this.state.user)
            ? <LoginComplete user={this.state.user} logout={this.logout} />
            : <button type="button" onClick={this.login}>Login With Google</button>
        }
      </div >
    )
  }
}
