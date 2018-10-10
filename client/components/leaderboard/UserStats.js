import React, { Component } from 'react'

export default class UserStats extends Component {
  render() {
    const { userStats, start, target, startTime, endTime, initTime } = this.props
    const history = userStats.history.join(' -> ')
    return (
      <div id="leaderboard-user-stats">
        <h3>Game Info</h3>
        <p>Start: {start}</p>
        <p><b>Target: {target}</b></p>
      </div>
    )
  }
}
