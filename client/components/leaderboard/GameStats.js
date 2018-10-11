import React, { Component } from 'react'
import { db } from '../../../server/db/config'
import Winners from './Winners'

// get winners utility
const getWinners = (clickInfo, players) => {
  const winnersArr = players.filter(user => {
    return clickInfo[user].won === true
  })
  let cleanWinners = []
  winnersArr.forEach(winner => {
    const points = clickInfo[winner].points
    cleanWinners.push([winner, points])
  })
  return cleanWinners.sort()
}

export default class GameStats extends Component {
  constructor() {
    super()
    this.state = {
      clickInfo: {},
      players: [],
      winners: []
    }
  }

  componentDidMount() {
    const gameRef = db.ref('GlobalGame')
    gameRef.on('value', snapshot => {
      if (snapshot.val() !== null) {
        const clickInfo = snapshot.val().clickInfo
        if (clickInfo !== undefined && clickInfo !== null) {
          const players = Object.keys(clickInfo)

          // get winners
          const winners = getWinners(clickInfo, players)

          this.setState({ clickInfo, players, winners })
        }
      }
    })
  }

  render() {
    const { players, clickInfo, winners } = this.state
    return (
      <div id="leaders">
        <h3>Players</h3>
        <div id="players">
          {
            (winners.length > 0)
              ? <Winners clickInfo={clickInfo} winners={winners} />
              : null
          }
          {
            players.map(player => {
              const { clicks, username, won } = clickInfo[player]
              if (won === false) {
                return (
                  <div key={player} id="player-single">
                    <p>{username} <span id="click-badge">{clicks}</span></p>
                  </div>
                )
              }
            })
          }
        </div>
      </div>
    )
  }
}

