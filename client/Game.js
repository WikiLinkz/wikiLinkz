import React, { Component } from 'react'
import axios from 'axios'
import Navbar from './Navbar'
import Pregame from './components/Pregame'
import Finished from './components/Finished'
import InGame from './components/InGame'
import { auth } from '../server/db/config'
import { underTitleize, titleize, secondsToTime, initializeTimer } from '../server/api/utils'
import './clean.css'

if (process.env.NODE_ENV !== 'production') require('../server/db/credentials')

export default class Game extends Component {
  constructor() {
    super()
    this.state = {
      gameId: null,
      userId: '',
      start: '',
      target: '',
      html: '',
      userStats: {
        history: [],
        clicks: 0,
        won: false
      },
      startTime: '',
      endTime: '',
      initTime: '',
      pregame: false,
      seconds: '',
      time: {},
      finished: false
    }

    this.updateLocalStats = this.updateLocalStats.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.generateGlobalGame = this.generateGlobalGame.bind(this)
    this.joinGlobalGame = this.joinGlobalGame.bind(this)
    this.stopGlobalGame = this.stopGlobalGame.bind(this)
    this.countDown = this.countDown.bind(this)
    this.startTimer = this.startTimer.bind(this)
    this.timer = 5
  }

  async componentDidMount() {
    try {
      //find the current game
      const res = await axios.get(`${process.env.HOST}/api/GlobalGame`)
      const { gameId, start, target, startTime, endTime, initTime } = res.data
      //check current user
      let userId
      await auth.onAuthStateChanged(user => {
        userId = user ? user.uid : null
      })
      //timer
      const initialTimer = initializeTimer(startTime, endTime)
      const { pregame, seconds } = initialTimer
      this.setState({ gameId, start, target, userId, startTime, endTime, initTime, pregame, seconds })
      this.timer = setInterval(this.countDown, 1000);
    } catch (err) { console.log('Error getting the current game', err) }
  }

  async componentDidUpdate() {
    // logic for if pregame ticker is at 0 and component is already loaded
    const { pregame, seconds, endTime, finished } = this.state

    if (pregame === true && seconds === 0) {
      clearInterval(this.timer)
      const timeNow = new Date()
      const timeToEnd = ((Date.parse(endTime) - Date.parse(timeNow)) / 1000)
      await this.setState({
        seconds: timeToEnd,
        pregame: false
      })
      await this.joinGlobalGame()
      this.timer = setInterval(this.countDown, 1000);
    }
    // logic for if game is loaded and is over
    else if (pregame === false && seconds === 0 && finished === false) {
      clearInterval(this.timer)
      this.setState({
        finished: true,
        pregame: false,
      })
    }
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

  // global game functions
  async generateGlobalGame() {
    try {
      // if a Global Game is already running, alert
      const getGameRes = await axios.get(`${process.env.HOST}/api/GlobalGame`)
      if (!getGameRes.data.error) {
        alert('Global Game Already Running')
      } else {
        // generate new start and target articles from wiki api
        const wikiRes = await axios.get(`${process.env.HOST}/api/wiki`)
        const { start, target } = wikiRes.data
        // create a new game with timer
        const res = await axios.post(`${process.env.HOST}/api/globalGame/`, { start, target })
        const { gameId, startTime, endTime, initTime } = res.data
        const timeNow = new Date()
        const timeToGameStart = ((Date.parse(startTime) - Date.parse(timeNow)) / 1000)
        this.setState({
          gameId, start, target, startTime, endTime, initTime, pregame: true, seconds: timeToGameStart, finished: false, userStats: {
            history: [],
            clicks: 0,
            won: false
          }
        })
        this.timer = setInterval(this.countDown, 1000);
      }
    } catch (error) { console.log('Error CREATING the global game', error) }
  }

  async joinGlobalGame() {
    try {
      // check if there's a global game
      const res = await axios.get(`${process.env.HOST}/api/globalGame/`)
      const { error } = res.data
      if (error === 'No game running!') {
        alert('No Global Game Running!')
      }
      else {
        // create player instance on the current game
        const { userId, gameId, userStats } = this.state
        await axios.put(`${process.env.HOST}/api/GlobalGame/${gameId}/${userId}`, { ...userStats })
        // add current game's id to user's game history
        await axios.put(`${process.env.HOST}/api/users/${userId}/${gameId}`)
        // get current game start and target titles
        const res = await axios.get(`${process.env.HOST}/api/GlobalGame/${gameId}`)
        let { start, target } = res.data
        // get start html
        start = underTitleize(start)
        const wikiRes = await axios.get(`${process.env.HOST}/api/wiki/${start}`)
        const html = wikiRes.data
        const { history } = this.state.userStats
        start = titleize(start)
        this.setState({
          start,
          target,
          html,
          userStats: {
            ...userStats,
            history: [...history, start]
          }
        })
      }
    } catch (error) { console.log('Error JOINING the global game', error) }
  }

  async stopGlobalGame() {
    try {
      clearInterval(this.timer)
      await axios.put(`${process.env.HOST}/api/globalGame/stopGlobalGame`)
      await this.setState({
        finished: true,
        pregame: false,
        time: {
          m: 0,
          s: 0,
        }
      })
    } catch (error) { console.log('Error STOPPING the global game', error) }
  }

  async handleClick(evt) {
    evt.preventDefault()
    if (evt.target.tagName !== 'A') return
    const { clicks, history, won } = this.state.userStats
    // check if player won
    console.log("WON?", evt.target.title === this.state.target)
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
    await axios.put(`${process.env.HOST}/api/GlobalGame/${gameId}/${userId}`, { ...userStats })
  }

  startTimer() {
    if (this.timer === 0 && this.state.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000)
    }
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds - 1;
    this.setState({
      time: secondsToTime(seconds),
      seconds: seconds,
    })

    // Check if we're at zero.
    if (seconds === 0) {
      clearInterval(this.timer)
    }
  }

  render() {
    const { start, target, html, userStats, gameId, startTime, endTime, initTime, pregame, finished, time } = this.state
    // pregame view
    return (
      <div id="container">
        <Navbar
          generateGlobalGame={this.generateGlobalGame}
          joinGlobalGame={this.joinGlobalGame}
          stopGlobalGame={this.stopGlobalGame}
        />
        {pregame ?
          <Pregame
            time={time}
            start={start}
            target={target}
          />
          : finished ?
            <Finished
              start={start}
              target={target}
              userStats={userStats}
            />
            : <InGame
              time={time}
              html={html}
              handleClick={this.handleClick}
              gameId={gameId}
              userStats={userStats}
              start={start}
              target={target}
              startTime={startTime}
              endTime={endTime}
              initTime={initTime}
            />
        }
      </div>
    )
  }
}
