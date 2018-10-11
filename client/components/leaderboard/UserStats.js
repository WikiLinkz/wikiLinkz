import React, { Component } from 'react'

export default class UserStats extends Component {
  render() {
    const { start, target } = this.props
    return (
      <div id="leaderboard-user-stats">
        <h3>Game Info</h3>
        <p>Start: {start}</p>
        <p><b>Target: {target}</b></p>
      </div>
    )
  }
}
