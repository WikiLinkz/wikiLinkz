import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { auth } from '../../../server/db/config'
import Chart from './Chart'
import './stats.css'

class Stats extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: '',
      games: [],
    }
  }

  componentDidMount() {
    let userId
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        userId = user.uid
        const res = await axios.get(`http://localhost:8080/api/users/${userId}/games`)
        const games = res.data
        const gameIds = Object.keys(games)
        const lastTenGames = gameIds.length < 10 ? gameIds : gameIds.slice(gameIds.length - 10)
        const gamesArr = lastTenGames.map(key => {
          return { ...games[key], game: `${games[key]['start']} - ${games[key]['target']}` }
        })
        console.log('gamesArr: ', gamesArr)
        this.setState({ games: gamesArr })
      }
    })
  }

  render() {
    return (
      <div className='container'>
        <div className='back-button'>
          <h1>Clicks and history of last 10 games</h1>
          <Link to='/'>
            Back to Game
          </Link>
        </div>
        <div className='chart'>
          <Chart games={this.state.games} />
        </div>
      </div>
    )
  }
}

export default Stats
