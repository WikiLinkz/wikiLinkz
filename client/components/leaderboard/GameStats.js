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
    const gameRef = await db.ref('Games/' + gameId)
    gameRef.on('value', snapshot => {
      console.log('snapshot', snapshot.val())
      const clickInfo = snapshot.val().clickInfo
      const players = Object.keys(clickInfo)
      this.setState({ clickInfo, players })
    })
  }

  render() {
    console.log('players', this.state.players)
    const { players, clickInfo } = this.state
    return (
      <div id="leaders">
        <h3>Leaders</h3>
        <div id="players">
          {
            players.map(player => {
              const clicks = clickInfo[player].clicks
              return (
                <div key="player" id="player-single">
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
