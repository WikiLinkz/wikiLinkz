import React, { Component } from 'react'
import './leaderboard.css'

export default class LeaderboardContainer extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div id='game-info-container-wrapper'>
        <div id='game-info-container'>
          <div id='game-info-container-fixed'>
            <h3>Game Info</h3>
            <h3>Time Remaining: :</h3>
            <p>Start: </p>
            <p>Target: </p>
            <p>History: </p>
            <p>Clicks: </p>
            <p>Users:</p>
            {/*map through users here*/}
            <ul>User1 (2)</ul>
            <ul>User2 (3)</ul>
          </div>
        </div>
      </div>
    )
  }
}
