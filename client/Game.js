import React, { Component } from 'react'
import { db } from '../server/db/config'
import axios from 'axios'

export default class Game extends Component {
  constructor() {
    super()
    this.state = {
      gameId: '',
      start: '',
      target: '',
      html: '',
      history: []
    }
    this.generateGame = this.generateGame.bind(this)
    this.joinGame = this.joinGame.bind(this)
  }

  async generateGame() {
    try {
      const res = await axios.post('/api/games')
      const gameId = res.data
      this.setState({ gameId })
    } catch (error) { console.log('Error CREATING the game', error) }
  }

  async joinGame() {
    try {
      const gameRef = db.ref(`Games/${this.state.gameId}`)
      gameRef.on('value', async (snapshot) => {
        let data = snapshot.val()
        this.setState({ start: data.start, target: data.target })
      })
    } catch (error) { console.log('Error JOINING the game', error) }
  }

  render() {
    return (
      <div>
        <button onClick={this.generateGame}>Generate Game</button>
        <button onClick={this.joinGame}>Join Game</button>
      </div>
    )
  }
}

