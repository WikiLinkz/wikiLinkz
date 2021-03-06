import React, { Component } from 'react'
import UserStats from './UserStats'
import GameStats from './GameStats'
import './leaderboard.css'

// UserStats is getting stats from user local state
// GameStats is the game data from Firebase

export default class LeaderboardContainer extends Component {
  render() {
    const { userStats, start, target, startTime, endTime, initTime } = this.props
    return (
      <div id='game-info-container-wrapper'>
        <div id='game-info-container'>
          <div id='game-info-container-fixed'>
            <UserStats userStats={userStats} start={start} target={target} startTime={startTime} endTime={endTime} initTime={initTime} />
            <GameStats />
          </div>
        </div>
      </div>
    )
  }
}
