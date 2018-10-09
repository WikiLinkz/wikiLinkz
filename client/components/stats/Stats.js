import React, { Component } from 'react'
import axios from 'axios'
import { auth } from '../../../server/db/config'
import Chart from './Chart'

class Stats extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: '',
      games: [],
    }
  }

  async componentDidMount() {
    let userId
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        userId = user.uid
        const res = await axios.get(`/api/users/${userId}/games`)
        const games = res.data
        console.log('games: ', games)
        const gameIds = Object.keys(games)
        console.log('gameIds: ', gameIds)
        const lastTenGames = gameIds.length < 10 ? gameIds : gameIds.slice(gameIds.length - 10)
        console.log('lastTenGames: ', lastTenGames)
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
        <Chart games={this.state.games} />
      </div>
    )
  }
}

export default Stats