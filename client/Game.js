import React, { Component } from 'react'
import axios from 'axios'

export default class Game extends Component {
  constructor() {
    super()
    this.startGame = this.startGame.bind(this)
  }

  async startGame() {
    try {
      let game = await axios.post('/api/games')
      let gameRef = game.data
      console.log('GAMEID', gameRef)
      // game.data.on('value', async (snapshot) => {
      //   let data = snapshot.val()
      //   console.log('Data in start', data)
      // })
    } catch (error) { console.log('Error GETTING the game', error) }
  }

  render() {
    return (
      <button onClick={this.startGame}>Generate Game</button>
    )
  }
}

