import React, { Component } from 'react'
import axios from 'axios'
import { underTitleize } from '../server/api/utils'
import './clean.css'
import Login from './components/login/Login'

if (process.env.NODE_ENV !== 'production') require('../server/db/credentials')

export default class Game extends Component {
  constructor() {
    super()
    this.state = {
      gameId: '',
      userId: 'pEOiFYGeJUOQd0awWTzRRC6Dpvy2',
      start: '',
      target: '',
      html: '',
      history: [],
      clicks: 0,
      won: false,
      isRunning: true
    }
    this.generateGame = this.generateGame.bind(this)
    this.joinGame = this.joinGame.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  async componentDidMount() {
    try {
      // find the current game
      const res = await axios.get(`${process.env.HOST}/api/games`)
      const { gameId, start, target } = res.data
      this.setState({ gameId, start, target })
    } catch (err) { console.log('Error getting the current game', err) }
  }

  async generateGame() {
    try {
      // kill previous game
      const gameId = this.state.gameId
      await axios.put(`${process.env.HOST}/api/games`, { gameId })
      // generate new start and target articles from wiki api
      const wikiRes = await axios.get(`${process.env.HOST}/api/wiki`)
      const { start, target } = wikiRes.data
      // create a new game
      const res = await axios.post(`${process.env.HOST}/api/games`, { start, target })
      const { newGameId } = res.data
      this.setState({ gameId: newGameId, start, target })
    } catch (err) { console.log('Error CREATING the game', err) }
  }

  async joinGame() {
    try {
      // create player instance on the current game
      const { userId, gameId, clicks, won } = this.state
      await axios.put(`${process.env.HOST}/api/games/${gameId}/${userId}`, { clicks, won })
      // add current game's id to user's game history
      await axios.put(`${process.env.HOST}/api/users/${userId}/${gameId}`)
      // get current game
      const res = await axios.get(`${process.env.HOST}/api/games/${gameId}`)
      const { start, target } = res.data
      // get start html
      const wikiRes = await axios.get(`${process.env.HOST}/api/wiki/${start}`)
      const html = wikiRes.data
      this.setState({ start, target, html, history: [...this.state.history, start] })
    } catch (error) { console.log('Error JOINING the game', error) }
  }

  async handleClick(evt) {
    evt.preventDefault()
    if (evt.target.tagName !== 'A') return
    // update click count, history
    const clicks = this.state.clicks + 1
    const history = [...this.state.history, evt.target.title]
    // check if player won
    const { won } = this.state
    if (title === this.state.target) { won = true }
    // fetch new article
    const title = underTitleize(evt.target.title)
    const wikiRes = await axios.get(`${process.env.HOST}/api/wiki/${title}`)
    await this.setState({ html: wikiRes.data, history, clicks, won })
    // update player's db instance
    const { gameId, userId } = this.state
    await axios.put(`${process.env.HOST}/api/games/${gameId}/${userId}`, { clicks, won })
  }

  render() {
    const { start, target, html, history, clicks, won } = this.state

    return (
      <div>
        <div id="game-container" style={{ padding: 25 }}>
          <header className="game-header">
            <h1 className="game-title">WikiLinks Game</h1>
            <Login />
          </header>
          <div>
            <button onClick={this.generateGame}>Generate Game</button>
            <button onClick={this.joinGame}>Join Game</button>
          </div>
          <div
            className='game-wikipedia-info-container'
            style={{ display: 'flex', borderStyle: 'solid', paddingLeft: 25 }}
          >
            <div
              className='game-wikipedia-render'
              style={{ flex: '3', height: '80vh', overflowY: 'scroll' }}
            >
              {(html === '') ? null :
                <div
                  className='wiki-article'
                  onClick={this.handleClick}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              }
            </div>
            <div
              className='game-info-container-wrapper'
              style={{ flex: '1', display: 'flex', flexDirection: 'column', backgroundColor: 'lightgrey' }}
            >
              <div
                className='game-info-container'
                style={{ flex: '1', padding: 20 }}
              >
                <div className='game-info-container-fixed' style={{ flex: '1' }}>
                  {won ?
                    <h3 style={{ textAlign: 'center', color: 'red' }}>YOU HAVE WON!!</h3> :
                    <h3 style={{ textAlign: 'center' }}>'Game Info'</h3>
                  }
                  {/* <h3 style={{ textAlign: 'center', }}>Time Remaining: {this.state.time.m}:{this.state.time.s}</h3> */}
                  <p>Start: {start}</p>
                  <p>Target: {target}</p>
                  <p>History: {history.join(', ')}</p>
                  <p>Clicks: {clicks}</p>
                  <p>Users:</p>
                  {/*map through users here*/}
                  <ul>User1 (2)</ul>
                  <ul>User2 (3)</ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
