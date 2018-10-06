import React, { Component } from 'react'
import { db } from '../../../server/db/config'
import LoginComplete from './LoginComplete'

export default class UserName extends Component {
  constructor() {
    super()
    this.state = {
      userName: '',
      available: false,
      complete: false
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.checkAvailability = this.checkAvailability.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(evt) {
    this.checkAvailability(evt.target.value)
    this.setState({
      userName: evt.target.value
    })
  }

  async checkAvailability(input) {
    const username = input.toLowerCase()
    const userNameRef = db.ref('/UserNames')
    await userNameRef.once('value', snapshot => {
      const userNameObj = snapshot.val()
      if (!userNameObj[username]) this.setState({ available: true })
      else this.setState({ available: false })
    })
  }

  async handleSubmit(evt) {
    evt.preventDefault()
    const { user } = this.props
    const username = this.state.userName.toLowerCase()

    // write username to firebase /Users
    const usersRef = db.ref('/Users')
    await usersRef.child(user.uid).set({
      username,
      userId: user.uid,
      email: user.email
    })

    // write username to firebase /UserNames
    const userNamesRef = db.ref('/UserNames')
    await userNamesRef.update({
      [username]: user.uid
    })

    this.setState({ complete: true })

  }

  render() {
    const { userName, available, complete } = this.state
    const enabled = userName.length > 5 && userName.length < 10 && available === true
    const showCheck = userName.length > 5 && userName.length < 10
    return (
      <div id="username">
        {
          complete
            ? <LoginComplete userName={userName} logout={this.props.logout} />
            : <form type="submit" onSubmit={this.handleSubmit}>
              Pick your username:<br />
              <input
                type="text"
                name="username"
                placeholder="username"
                onChange={this.handleChange}

              />
              <button
                type="submit"
                disabled={!enabled}>
                Submit
            </button>
              <div id="req-check">
                {
                  showCheck
                    ? <div id="check">
                      {
                        available
                          ? <p id="username-good">@{userName} is available</p>
                          : <p id="username-bad">@{userName} is taken</p>
                      }
                    </div>
                    : null
                }
              </div>
              <div id="req">
                <ul>
                  <li>between 5 and 10 characters</li>
                  <li>letters and numbers only</li>
                </ul>
              </div>
            </form>
        }
      </div>
    )
  }
}
