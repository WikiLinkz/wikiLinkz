import React, { Component } from 'react'
import { db } from '../../server/db/config'


export default class GlobalGameInfo extends Component {
  constructor() {
    super();
    this.state = {
      start: '',
      target: ''
    }
  }

  async componentDidMount() {
    await db.ref('GlobalGame').on('value', async snapshot => {
      snapshot.forEach(async currentGame => {

        const gameId = currentGame.key
        await db.ref('GlobalGame/' + gameId).on('value', async snapshot => {
          const gameData = snapshot.val()
          if (gameData === null) {
            this.setState({
              start: '',
              target: ''
            })
          }
          else {
            this.setState({
              start: gameData.start,
              target: gameData.target
            })
          }
        })
      })
    })
  }


  render() {
    if (this.state.target) {
      return (
        <div className="global-game-info" >
          <p>Global Game Running! <br /><b>Start:</b> {this.state.start} <b>Target:</b> {this.state.target}</p>
        </div >
      )
    } else return (
      <div className="global-game-info" >
        <p>No Global Game Running: Click Generate Below To Begin One!</p>
      </div>
    )
  }
}
