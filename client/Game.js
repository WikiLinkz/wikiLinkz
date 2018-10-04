import React, { Component } from 'react'
import axios from 'axios'
import { underTitleize } from '../server/api/utils'
import './clean.css'
import Login from './components/login/Login'
import LeaderboardContainer from './components/leaderboard/LeaderboardContainer';

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
      },
      isRunning: true
    }

    this.setUser = this.setUser.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.testClicks = this.testClicks.bind(this)
    this.generateGame = this.generateGame.bind(this)
    this.joinGame = this.joinGame.bind(this)
  }

  setUser(userId) {
    this.setState({ userId })
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
      console.log('WE ARE IN COMPONENT DID MOUNT AGAIN')
      const res = await axios.get('/api/games')
      const { gameId, start, target } = res.data
      this.setState({ gameId, start, target })
    } catch (err) { console.log('Error getting the current game', err) }
  }

  async generateGame() {
    try {
      console.log('IN GENERATE GAME')
      const gameId = this.state.gameId
      await axios.put('/api/games', { gameId })
      console.log('DID WE SURVIVE THE PUT?? ENTERING POST ROUTE')
      const res = await axios.post('/api/games')
      const { newGameId, start, target } = res.data
      console.log('NEW GAME CREATED')
      this.setState({ gameId: newGameId, start, target })
    } catch (err) { console.log('Error CREATING the game', err) }
  }

  async joinGame() {
    try {
      const res = await axios.get(`/api/games/${this.state.gameId}`)
      const { start, target, html } = res.data
      this.setState({ start, target, html })
    } catch (error) { console.log('Error JOINING the game', error) }
  }

  async handleClick(evt) {
    evt.preventDefault()
    if (evt.target.tagName !== 'A') return

    const title = underTitleize(evt.target.title)
    const { gameId, userId } = this.state
    const res = await axios.put(`/api/games/${gameId}/${userId}`, { title })
    // const res = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/html/${this.state.title}`)
    // this.setState({ html: res.data })
    // console.log('clicked title: ', title, 'target title: ', this.state.target)
    // if (title === this.state.target) { alert('DAAAAAMN!') }
  }

  render() {
    const { userStats, gameId, start, target } = this.state
    return (
      <div>
        <div id="game-container" style={{ padding: 25 }}>
          <header className="game-header">
            <h1 className="game-title">WikiLinks Game</h1>
          </header>
          <Login setUser={this.setUser} />
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

