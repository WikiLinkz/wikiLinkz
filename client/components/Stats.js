import React, { Component } from 'react'
import axios from 'axios'

class Stats extends Component {
  constructor() {
    super()
    this.state = {
      userId: '',
      gameHistory: '',
    }
  }

  async componentDidMount() {
    const { userId } = this.state
    const gamesRes = await axios.get(`/api/users/${userId}/games`)
    const gameHistory = gamesRes.data
    this.setState({ gameHistory })
  }

  render() {
    return (
      <div>
        <h1>HII</h1>
      </div>
    )
  }
}

export default Stats