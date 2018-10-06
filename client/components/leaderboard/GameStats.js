import React, { Component } from 'react'
import { db } from '../../../server/db/config'

export default class GameStats extends Component {
  constructor() {
    super()
    this.state = {
      clickInfo: {},
      players: []
    }
  }

  async componentDidMount() {
    const { gameId } = this.props
    const gameRef = await db.ref('GlobalGame/' + gameId)
    gameRef.on('value', snapshot => {
      if (snapshot.val() !== null) {
        const clickInfo = snapshot.val().clickInfo
        console.log(clickInfo)
        if (clickInfo !== undefined && clickInfo !== null) {
          const players = Object.keys(clickInfo)
          this.setState({ clickInfo, players })
        }
      }
    })
  }

  async componentDidUpdate(prevProps) {
    const oldGame = prevProps.gameId
    const newGame = this.props.gameId
    if (oldGame !== newGame) {
      const { gameId } = this.props
      if (gameId) {
        const gameRef = await db.ref('GlobalGame/' + gameId)
        gameRef.on('value', snapshot => {
          const clickInfo = snapshot.val().clickInfo
          if (clickInfo !== undefined && clickInfo !== null) {
            const players = Object.keys(clickInfo)
            this.setState({ clickInfo, players })
          }
        })
      }
    }
  }

  render() {
    const { players, clickInfo } = this.state
    return (
      <div id="leaders">
        <h3>Leaders</h3>
        <div id="players">
          {
            players.map(player => {
              const clicks = clickInfo[player].clicks
              return (
                <div key={player} id="player-single">
                  <p>Name: {player}</p>
                  <p>Clicks: {clicks}</p>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}
