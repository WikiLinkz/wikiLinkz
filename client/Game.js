import React, { Component } from 'react'
import axios from 'axios'
import './clean.css'
import Login from './components/login/Login'
import LeaderboardContainer from './components/leaderboard/LeaderBoardContainer';

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
      start: '',
      target: '',
      html: '',
      history: [],
      clicks: 0,
      currentGame: {}
    }
    this.generateGame = this.generateGame.bind(this)
    this.joinGame = this.joinGame.bind(this)
  }

  // testing
  componentDidMount() {
    this.setState({
      currentGame: dummyData
    })
  }

  async generateGame() {
    try {
      const res = await axios.post('/api/games')
      const { newGameId, start, target } = res.data
      this.setState({ gameId: newGameId, start, target })
    } catch (error) { console.log('Error CREATING the game', error) }
  }

  async joinGame() {
    try {
      const res = await axios.get(`/api/games/${this.state.gameId}`)
      const { start, target, html } = res.data
      this.setState({ start, target, html, history: [...this.state.history, start] })
    } catch (error) { console.log('Error JOINING the game', error) }
  }

  render() {
    const { currentGame } = this.state
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
              <LeaderboardContainer currentGame={currentGame} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

