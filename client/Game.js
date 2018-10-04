import React, { Component } from 'react'
import axios from 'axios'
import { underTitleize } from '../server/api/utils'
import './clean.css'
import Login from './components/login/Login'
import LeaderboardContainer from './components/leaderboard/LeaderboardContainer';

const dummyData = {
  isRunning: true,
  start: 'Instagram',
  target: 'Tesla, Inc.',
  // players: {
  //   0: 'email1',
  //   1: 'email2',
  //   2: 'email3',
  //   3: 'email4',
  // },
  clickInfo: {
    userName1: {
      clickNum: 0,
      score: 0,
      won: false
    },
    userName2: {
      clickNum: 0,
      score: 0,
      won: false
    },
    userName3: {
      clickNum: 0,
      score: 0,
      won: false
    },
    userName4: {
      clickNum: 0,
      score: 0,
      won: false
    }
  }
}

export default class Game extends Component {
  constructor() {
    super()
    this.state = {
      gameId: '',
      userId: '',
      start: '',
      target: '',
      html: '',
      history: [],
      clicks: 0,
      isRunning: true
    }
    this.generateGame = this.generateGame.bind(this)
    this.joinGame = this.joinGame.bind(this)
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
      this.setState({ start, target, html, history: [...this.state.history, start] })
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
    const { currentGame, userStats } = this.state
    return (
      <div>
        <div id="game-container" style={{ padding: 25 }}>
          <header className="game-header">
            <h1 className="game-title">WikiLinks Game</h1>
          </header>
          <Login />
          <div>
            <button onClick={this.generateGame}>Generate Game</button>
            <button onClick={this.joinGame}>Join Game</button>
            <div className='game-wikipedia-info-container' style={{ display: 'flex', borderStyle: 'solid', paddingLeft: 25 }}>
              <div className='game-wikipedia-render' style={{ flex: '3', height: '80vh', overflowY: 'scroll' }}>
                {
                  (this.state.html === '') ? null : <div className='wiki-article' onClick={this.handleClick} dangerouslySetInnerHTML={{ __html: this.state.html }} />
                }
              </div>
              <LeaderboardContainer currentGame={currentGame} userStats={userStats} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

