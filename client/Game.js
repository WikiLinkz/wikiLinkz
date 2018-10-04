import React, { Component } from 'react'
import axios from 'axios'
import { underTitleize } from '../server/api/utils'
import './clean.css'
import Login from './components/login/Login'
import LeaderboardContainer from './components/leaderboard/LeaderboardContainer'
import { auth } from '../server/db/config'

if (process.env.NODE_ENV !== 'production') require('../server/db/credentials')

export default class Game extends Component {
  constructor() {
    super()
    this.state = {
      gameId: '',
      userId: '',
      start: '',
      target: '',
      html: '',
      userStats: {
        history: [],
        clicks: 0,
        won: false
      },
      isRunning: true
    }

    this.handleClick = this.handleClick.bind(this)
    this.testClicks = this.testClicks.bind(this)
    this.generateGame = this.generateGame.bind(this)
    this.joinGame = this.joinGame.bind(this)
  }

  testClicks() {
    const title = 'title'
    const clickNum = this.state.userStats.clicks
    const history = this.state.userStats.history
    this.setState({
      userStats: {
        clicks: clickNum + 1,
        history: [...history, title]
      }
    })
  }

  async componentDidMount() {
    try {
      const res = await axios.get(`${process.env.HOST}/api/games`)
      const { gameId, start, target } = res.data

      // check if a user is logged in
      let userId
      await auth.onAuthStateChanged(user => {
        if (user) {
          userId = user.uid
          this.setState({ gameId, start, target, userId })
        } else {
          userId = null
          this.setState({ gameId, start, target, userId })
        }
      })
    } catch (err) { console.log('Error getting the current game', err) }
  }

  async generateGame() {
    try {
      const gameId = this.state.gameId
      await axios.put(`${process.env.HOST}/api/games`, { gameId })
      const res = await axios.post(`${process.env.HOST}/api/games`)
      const { newGameId, start, target } = res.data
      this.setState({ gameId: newGameId, start, target })
    } catch (err) { console.log('Error CREATING the game', err) }
  }

  async joinGame() {
    try {
      const { userId, gameId, userStats } = this.state
      await axios.put(`${process.env.HOST}/api/games/${gameId}/${userId}`, { ...userStats })
      await axios.put(`${process.env.HOST}/api/users/${userId}/${gameId}`)
      const res = await axios.get(`${process.env.HOST}/api/games/${gameId}`)
      const { start, target, html } = res.data
      this.setState({ start, target, html })
    } catch (error) { console.log('Error JOINING the game', error) }
  }

  async handleClick(evt) {
    evt.preventDefault()
    if (evt.target.tagName !== 'A') return
    // update the database
    const { gameId, userId, userStats } = this.state
    const title = underTitleize(evt.target.title)
    const res = await axios.put(`${process.env.HOST}/api/games/${gameId}/${userId}`, { ...userStats, title })
    const { html } = res.data
    this.setState({ html })
  }

  render() {
    const { userStats, gameId, start, target } = this.state
    return (
      <div>
        <div id="game-container" style={{ padding: 25 }}>
          <header className="game-header">
            <h1 className="game-title">WikiLinks Game</h1>
          </header>
          <Login />
          <button type="button" onClick={this.testClicks}>Test Clicks</button>
          <div>
            <button onClick={this.generateGame}>Generate Game</button>
            <button onClick={this.joinGame}>Join Game</button>
            <div className='game-wikipedia-info-container' style={{ display: 'flex', borderStyle: 'solid', paddingLeft: 25 }}>
              <div className='game-wikipedia-render' style={{ flex: '3', height: '80vh', overflowY: 'scroll' }}>
                {
                  (this.state.html === '') ? null : <div className='wiki-article' onClick={this.handleClick} dangerouslySetInnerHTML={{ __html: this.state.html }} />
                }
              </div>
              <LeaderboardContainer gameId={gameId} userStats={userStats} start={start} target={target} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

