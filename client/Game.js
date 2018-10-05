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

    this.updateLocalStats = this.updateLocalStats.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.generateGame = this.generateGame.bind(this)
    this.joinGame = this.joinGame.bind(this)
  }

  updateLocalStats(newStats) {
    this.setState({
      userStats: {
        clicks: newStats.updatedClicks,
        history: newStats.updatedHistory,
        won: newStats.updatedWon
      }
    })
  }

  async componentDidMount() {
    try {
      // find the current game
      const res = await axios.get(`${process.env.HOST}/api/games`)
      const { gameId, start, target } = res.data
      // check if a user is logged in
      let userId
      await auth.onAuthStateChanged(user => {
        if (user) {
          userId = user.uid
          console.log('User logged in')
          this.setState({ gameId, start, target, userId })
        } else {
          userId = null
          console.log('User NOT logged in')
          this.setState({ gameId, start, target, userId })
        }
      })
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
      const { userId, gameId, userStats } = this.state
      await axios.put(`${process.env.HOST}/api/games/${gameId}/${userId}`, { ...userStats })
      // add current game's id to user's game history
      await axios.put(`${process.env.HOST}/api/users/${userId}/${gameId}`)
      // get current game
      const res = await axios.get(`${process.env.HOST}/api/games/${gameId}`)
      let { start, target } = res.data
      // get start html
      start = underTitleize(start)
      const wikiRes = await axios.get(`${process.env.HOST}/api/wiki/${start}`)
      const html = wikiRes.data
      const { history } = this.state.userStats
      this.setState({
        start,
        target,
        html,
        userStats: {
          ...userStats,
          history: [...history, start]
        }
      })
    } catch (error) { console.log('Error JOINING the game', error) }
  }

  async handleClick(evt) {
    evt.preventDefault()
    if (evt.target.tagName !== 'A') return
    const { clicks, history } = this.state.userStats
    // check if player won
    let { won } = this.state.userStats
    if (evt.target.title === this.state.target) { won = true }
    // update click count, history
    const updatedStats = {
      updatedClicks: clicks + 1,
      updatedHistory: [...history, evt.target.title],
      updatedWon: won
    }
    this.updateLocalStats(updatedStats)
    // fetch new article
    const title = underTitleize(evt.target.title)
    const wikiRes = await axios.get(`${process.env.HOST}/api/wiki/${title}`)
    await this.setState({ html: wikiRes.data })
    // update player's db instance
    const { gameId, userId, userStats } = this.state
    await axios.put(`${process.env.HOST}/api/games/${gameId}/${userId}`, { ...userStats })
  }

  render() {
    const { start, target, html, userStats, gameId } = this.state

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
            <LeaderboardContainer gameId={gameId} userStats={userStats} start={start} target={target} />
          </div>
        </div>
      </div >
    )
  }
}