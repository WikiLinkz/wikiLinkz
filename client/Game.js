import React, { Component } from 'react'
import { db } from '../server/db/config'
import { underTitleize } from '../server/api/utils'
import axios from 'axios'
// import './clean.css'

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
        const data = snapshot.val()
        const title = underTitleize(data.start)
        const res = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/html/${title}`)
        this.setState({ start: data.start, target: data.target, html: res.data })
      })
    } catch (error) { console.log('Error JOINING the game', error) }
  }

  render() {
    return (
      <div>
        <div>
          <header className="game-header">
            <h1 className="game-title">WikiLinks Game</h1>
          </header>
          <div>
            <button onClick={this.generateGame}>Generate Game</button>
            <button onClick={this.joinGame}>Join Game</button>
            <div className='game-wikipedia-info-container' style={{ display: 'flex', borderStyle: 'solid', paddingLeft: 25 }}>
              <div className='game-wikipedia-render' style={{ flex: '3', height: '80vh', overflowY: 'scroll' }}>
                {
                  (this.state.html === '') ? null : <div className='wiki-article' onClick={this.handleClick} dangerouslySetInnerHTML={{ __html: this.state.html }} />
                }
              </div>
            </div>
          </div>
        </div>
        <div className='game-info-container-wrapper' style={{ flex: '1', display: 'flex', flexDirection: 'column', backgroundColor: 'lightgrey' }}>
          <div className='game-info-container' style={{ flex: '1', padding: 20 }}>
            <div className='game-info-container-fixed' style={{ flex: '1' }}>
              <h3 style={{ textAlign: 'center', }}>Game Info</h3>
              {/* <h3 style={{ textAlign: 'center', }}>Time Remaining: {this.state.time.m}:{this.state.time.s}</h3> */}
              <p>Start: {this.state.start}</p>
              <p>Target: {this.state.target}</p>
              <p>History: {''}</p>
              <p>Clicks: {''}</p>
              <p>Users:</p>
              {/*map through users here*/}
              <ul>User1 (2)</ul>
              <ul>User2 (3)</ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

