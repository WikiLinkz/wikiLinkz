import React, { Component } from 'react'
import UserStats from './UserStats'
import './leaderboard.css'

// UserStats is getting stats from user local state
// GameStats is the game data from Firebase

export default class LeaderboardContainer extends Component {
  constructor() {
    super()
  }

  render() {
    const { userStats } = this.props
    return (
      <div id='game-info-container-wrapper'>
        <div id='game-info-container'>
          <div id='game-info-container-fixed'>
            <UserStats userStats={userStats} />
            {/*map through users here*/}
            <ul>User1 (2)</ul>
            <ul>User2 (3)</ul>
          </div>
        </div>
      </div>
    )
  }
}
