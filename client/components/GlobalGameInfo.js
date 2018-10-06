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
          <h4>Global Game Running</h4>
          <p>Start: {this.state.start}</p>
          <p>Target: {this.state.target}</p>

        </div >
      )
    } else return (
      <div className="global-game-info" >
        <h4>No Global Game Running: Click Generate Below To Begin One!</h4>
      </div>
    )
  }
}
