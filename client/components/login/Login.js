import React, { Component } from 'react'
import { googleProvider, auth, db } from '../../../server/db/config'
import LoginComplete from './LoginComplete'
import UserName from './UserName'
import './login.css'

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      newUser: false,
      userName: null
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
      const usersRef = db.ref('/Users')
      const uid = user.uid

      // check if user exists in /Users
      let userName
      let newUser = false
      await usersRef.child(uid).once('value', (snapshot) => {
        const userObj = snapshot.val()
        if (userObj === null) {
          newUser = true
        } else {
          userName = userObj.username
        }
      });
      this.setState({ user, newUser, userName })
    } catch (err) {
      console.log('Error logging in', err)
    }
  }

  async logout() {
    await auth.signOut()
    this.setState({ user: null })
  }

  render() {
    const { user, newUser, userName } = this.state
    return (
      <div id="login" >
        {
          newUser
            ? <UserName user={user} logout={this.logout} />
            :
            <div id="returning-user">
              {
                user
                  ? <LoginComplete userName={userName} logout={this.logout} />
                  : <button type="button" onClick={this.login}>Login With Google</button>
              }
            </div>
        }
      </div >
    )
  }
}
