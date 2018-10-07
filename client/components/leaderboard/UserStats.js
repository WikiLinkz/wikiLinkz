import React, { Component } from 'react'

export default class UserStats extends Component {
  render() {
    const { userStats, start, target, startTime, endTime } = this.props
    const history = userStats.history.join(' -> ')
    return (
      <div id="leaderboard-user-stats">
        <h3>Game Info</h3>
        <p>Start: {start}</p>
        <p><b>Target: {target}</b></p>
        <p>Start Time: {startTime}</p>
        <p>End Time: {endTime}</p>
        <p>History: {history}</p>
        <p>Clicks: {userStats.clicks}</p>
      </div>
    )
  }
}
