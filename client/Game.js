import React, { Component } from 'react'
import axios from 'axios'
import Navbar from './Navbar'
import Pregame from './components/Pregame'
import Finished from './components/Finished'
import InGame from './components/InGame'
import { auth, db } from '../server/db/config'
import { underTitleize, secondsToTime, initializeTimer } from '../server/api/utils'
import './clean.css'
// import './game.css'
import NoGame from './components/NoGame'

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
        won: false,
        username: '',
      },
      startTime: '',
      endTime: '',
      startSummary: '',
      targetSummary: '',
      startImg: '',
      targetImg: '',
      initTime: '',
      pregame: false,
      seconds: '',
      time: {},
      finished: false,
      inGame: false,
    }
    this.updateLocalStats = this.updateLocalStats.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.generateGlobalGame = this.generateGlobalGame.bind(this)
    this.joinGlobalGame = this.joinGlobalGame.bind(this)
    this.stopGlobalGame = this.stopGlobalGame.bind(this)
    this.countDown = this.countDown.bind(this)
    this.startTimer = this.startTimer.bind(this)
    this.timer = 0
  }

  async componentDidMount() {
    clearInterval(this.timer)
    try {
      const globalGameRef = db.ref('GlobalGame')
      globalGameRef.on('value', async snapshot => {
        const gameData = snapshot.val()
        if (gameData === null) {
          this.setState({ pregame: true, inGame: false, gameId: null })
        } else {
          const {
            gameId,
            start,
            startSummary,
            targetSummary,
            startImg,
            targetImg,
            target,
            startTime,
            endTime,
            initTime,
            pregame,
            postgame,
          } = gameData
          const initialTimer = await initializeTimer(startTime, endTime)
          const { seconds } = initialTimer
          // check userId and set state
          let userId, finished
          // get current userId OR set userId to NULL if guest
          auth.onAuthStateChanged(async user => {
            userId = user ? user.uid : null
            finished = gameData.finished ? (finished = true) : (finished = false)
            //get username
            var username
            if (userId) {
              const userRef = db.ref(`Users/${userId}`)
              userRef.once('value', async snapshot => {
                const user = snapshot.val()
                username = user.username
                if (this.state.finished || gameData.finished) {
                  await this.setState({
                    gameId,
                    start,
                    startSummary,
                    target,
                    targetSummary,
                    startImg,
                    targetImg,
                    userId,
                    startTime,
                    endTime,
                    initTime,
                    pregame,
                    seconds,
                    finished: true,
                    inGame: false,
                    postgame,
                    userStats: { ...this.state.userStats, username },
                  })
                } else {
                  await this.setState({
                    gameId,
                    start,
                    startSummary,
                    target,
                    targetSummary,
                    startImg,
                    targetImg,
                    userId,
                    startTime,
                    endTime,
                    initTime,
                    pregame,
                    seconds,
                    finished,
                    postgame,
                    userStats: { ...this.state.userStats, username },
                  })
                }
              })
            } else {
              if (this.state.finished || gameData.finished) {
                await this.setState({
                  gameId,
                  start,
                  startSummary,
                  target,
                  targetSummary,
                  startImg,
                  targetImg,
                  userId,
                  startTime,
                  endTime,
                  initTime,
                  pregame,
                  seconds,
                  postgame,
                  finished: true,
                  inGame: false,
                })
              } else {
                await this.setState({
                  gameId,
                  start,
                  startSummary,
                  target,
                  targetSummary,
                  startImg,
                  targetImg,
                  userId,
                  startTime,
                  endTime,
                  initTime,
                  pregame,
                  seconds,
                  finished,
                  postgame,
                })
              }
            }
          })
          this.startTimer()
        }
      })
    } catch (err) {
      console.log('Error getting the current game', err)
    }
  }

  componentDidUpdate() {
    if (parseInt(this.state.seconds) < 0) {
      clearInterval(this.timer)
      this.timer = 0
    }
  }

  startTimer() {
    if (this.timer === 0) {
      this.timer = setInterval(this.countDown, 1000)
    }
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds - 1
    this.setState({
      time: secondsToTime(seconds),
      seconds: seconds,
    })

    // Check if we're at zero.
    if (seconds === 0) {
      clearInterval(this.timer)
      this.timer = 0
    }
  }

  updateLocalStats(newStats) {
    if (newStats.updatedWon) {
      this.setState({
        userStats: {
          clicks: newStats.updatedClicks,
          history: newStats.updatedHistory,
          won: newStats.updatedWon,
          username: newStats.updatedUsername,
        },
        finished: true,
        inGame: false,
      })
    } else {
      this.setState({
        userStats: {
          clicks: newStats.updatedClicks,
          history: newStats.updatedHistory,
          won: newStats.updatedWon,
          username: newStats.updatedUsername,
        },
      })
    }
  }

  // global game functions
  async generateGlobalGame() {
    try {
      // generate new start and target articles from wiki api
      const wikiRes = await axios.get(`/api/wiki`)
      const { start, target, startSummary, targetSummary, startImg, targetImg } = wikiRes.data
      // create a new game with timer
      const res = await axios.post(`/api/globalGame/`, {
        start,
        target,
        startSummary,
        targetSummary,
        startImg,
        targetImg,
      })
      const { gameId, startTime, endTime, initTime } = res.data
      const timeNow = await axios.get('/api/globalGame/time')
      const timeToGameStart = (Date.parse(startTime) - Date.parse(timeNow.data)) / 1000
      this.setState({
        gameId,
        start,
        target,
        startTime,
        endTime,
        initTime,
        pregame: true,
        seconds: timeToGameStart,
        finished: false,
        userStats: {
          history: [],
          clicks: 0,
          won: false,
        },
      })
    } catch (error) {
      console.log('Error CREATING the global game', error)
    }
  }

  async joinGlobalGame() {
    try {
      const { userId, gameId, userStats, start, target } = this.state
      const userInfo = {
        clicks: 0,
        won: false,
        username: userStats.username,
        history: [],
      }
      if (userId) {
        // create player instance on the current game
        await axios.put(`/api/globalGame/${userId}`, userInfo)
        // add current game's id to user's game history
        await axios.put(`/api/users/${userId}/${gameId}`, {
          ...userInfo,
          start,
          target,
          history: '',
        })
      }
      // get start html
      const underscoredStart = underTitleize(start)
      const wikiRes = await axios.get(`/api/wiki/${underscoredStart}`)
      const html = wikiRes.data
      this.setState({
        html,
        inGame: true,
        finished: false,
        userStats: {
          history: [start],
          clicks: 0,
          won: false,
          username: this.state.userStats.username,
        },
      })
    } catch (error) {
      console.log('Error JOINING the global game', error)
    }
  }

  async stopGlobalGame() {
    try {
      clearInterval(this.timer)
      await axios.put(`/api/globalGame/stopGlobalGame`)
      await this.setState({
        finished: true,
        pregame: false,
        time: {
          m: 0,
          s: 0,
        },
      })
    } catch (error) {
      console.log('Error STOPPING the global game', error)
    }
  }

  async handleClick(evt) {
    evt.preventDefault()
    if (evt.target.tagName !== 'A') return
    let { clicks, history, won, username } = this.state.userStats
    // check if player won
    if (evt.target.title === this.state.target) {
      won = true
    }
    // update click count, history
    const updatedStats = {
      updatedClicks: clicks + 1,
      updatedHistory: [...history, evt.target.title],
      updatedWon: won,
      updatedUsername: username,
    }
    this.updateLocalStats(updatedStats)
    // fetch new article
    const title = underTitleize(evt.target.title)
    const wikiRes = await axios.get(`/api/wiki/${title}`)
    await this.setState({ html: wikiRes.data })
    const { userId, userStats } = this.state
    if (userId) {
      // update player's db instance
      await axios.put(`/api/globalGame/${userId}`, { ...userStats })
    }
  }

  render() {
    const {
      start,
      startSummary,
      target,
      targetSummary,
      startImg,
      targetImg,
      html,
      gameId,
      userStats,
      startTime,
      endTime,
      initTime,
      pregame,
      finished,
      inGame,
      time,
      postgame,
    } = this.state
    const { won } = userStats
    console.log(this.state.postgame)
    // pregame view
    return (
      <div id="container">
        <Navbar />
        {finished || won ? <Finished start={start} target={target} userStats={userStats} /> : null}
        {gameId === null ? (
          <NoGame generateGlobalGame={this.generateGlobalGame} />
        ) : inGame ? (
          <InGame
            time={time}
            html={html}
            handleClick={this.handleClick}
            userStats={userStats}
            start={start}
            target={target}
            startTime={startTime}
            endTime={endTime}
            initTime={initTime}
          />
        ) : (
          <Pregame
            time={time}
            start={start}
            startSummary={startSummary}
            targetSummary={targetSummary}
            startImg={startImg}
            targetImg={targetImg}
            target={target}
            pregame={pregame}
            postgame={postgame}
            finished={finished}
            joinGlobalGame={this.joinGlobalGame}
          />
        )}
      </div>
    )
  }
}
