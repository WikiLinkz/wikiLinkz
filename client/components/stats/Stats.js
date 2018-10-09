import React, { Component } from 'react'
import axios from 'axios'
import { auth } from '../../../server/db/config'
import Chart from './Chart'

const dummydata = {
  '-LOJJP9IpAJlmbsSTCQN': {
    start: '1',
    target: '5',
    clicks: 5,
    history: "1,2,3,4,5",
    won: true
  },
  '-LOJJlIMd1knLkWZuDMx': {
    start: '2',
    target: '10',
    clicks: 10,
    history: "2,3,4,1,5,6,7,8,9,10",
    won: true
  },
  '-LOJO09EEurEYFTlP-38': {
    start: '5',
    target: '9',
    clicks: 3,
    history: "5,6,7",
    won: false
  },
  '-LOJRDscRV8aMHN5RSXa': {
    start: '1',
    target: '5',
    clicks: 1,
    history: '9',
    won: false
  },
  '-LOJSDGqHBLAfxvht98W': {
    start: '1',
    target: '5',
    clicks: 0,
    history: "",
    won: false
  }
}

class Stats extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: '',
      games: '',
    }
  }

  async componentDidMount() {
    let userId
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        userId = user.uid
        const res = await axios.get(`/api/users/${userId}/games`)
        const games = res.data
        console.log('GAMES', games)
        this.setState({ games })
      }
    })
    // const lastTenGames = games.length < 10 ? games : games.slice(games.length - 10)
  }

  render() {
    return (
      <Chart data={dummydata} />
    )
  }
}

export default Stats