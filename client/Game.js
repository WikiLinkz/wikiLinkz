import React, { Component } from 'react'
import axios from 'axios'
import { underTitleize, titleize } from '../server/api/utils'
import './clean.css'
import Login from './components/login/Login'
import LeaderboardContainer from './components/leaderboard/LeaderboardContainer'
import { auth } from '../server/db/config'
import GlobalGameInfo from './components/GlobalGameInfo'

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
    // this.generateGame = this.generateGame.bind(this)
    // this.joinGame = this.joinGame.bind(this)
    this.generateGlobalGame = this.generateGlobalGame.bind(this)
    this.joinGlobalGame = this.joinGlobalGame.bind(this)
    this.stopGlobalGame = this.stopGlobalGame.bind(this)
    this.countDown = this.countDown.bind(this)
    this.startTimer - this.startTimer.bind(this)
    this.timer = 5
  }




  async componentDidMount() {
    try {
      //find the current game
      const res = await axios.get(`${process.env.HOST}/api/GlobalGame`)
      const { gameId, start, target, startTime, endTime, initTime } = res.data
      let userId
      await auth.onAuthStateChanged(user => {
        userId = user ? user.uid : null
        this.setState({ gameId, start, target, userId, startTime, endTime, initTime })
      })
      const timeNow = new Date()
      // difference in seconds from mount to game startTime
      const timeToGameStart = ((Date.parse(startTime) - Date.parse(timeNow)) / 1000)
      // logic for if global game is in pregame state
      if (timeToGameStart > 0) {
        this.setState({
          pregame: true,
          seconds: timeToGameStart
        })
        this.timer = setInterval(this.countDown, 1000);
      }
      // logic for if global game is in game state
      else if (timeToGameStart < 0) {
        const timeToEnd = ((Date.parse(endTime) - Date.parse(timeNow)) / 1000)
        this.setState({
          pregame: false,
          seconds: timeToEnd
        })
        this.timer = setInterval(this.countDown, 1000);
      }
    } catch (err) { console.log('Error getting the current game', err) }
  }

  async componentDidUpdate() {
    // logic for if pregame ticker is at 0 and component is already loaded
    if (this.state.pregame === true && this.state.seconds === 0) {
      clearInterval(this.timer)
      const timeNow = new Date()
      const timeToEnd = ((Date.parse(this.state.endTime) - Date.parse(timeNow)) / 1000)
      await this.setState({
        seconds: timeToEnd,
        pregame: false
      })
      await this.joinGlobalGame()
      this.timer = setInterval(this.countDown, 1000);
    }
    // logic for if game is loaded and is over
    else if (this.state.pregame === false && this.state.seconds === 0 && this.state.finished === false) {
      clearInterval(this.timer)
      this.setState({
        finished: true,
        pregame: false,
      })

    }
  }

  // async generateGame() {
  //   try {
  //     // kill previous game
  //     const gameId = this.state.gameId
  //     await axios.put(`${process.env.HOST}/api/games`, { gameId })
  //     // generate new start and target articles from wiki api
  //     const wikiRes = await axios.get(`${process.env.HOST}/api/wiki`)
  //     const { start, target } = wikiRes.data
  //     // create a new game
  //     const res = await axios.post(`${process.env.HOST}/api/games`, { start, target })
  //     const { newGameId } = res.data
  //     const newUserInfo = { clicks: 0, history: [], won: false }
  //     this.setState({
  //       gameId: newGameId,
  //       start,
  //       target,
  //       html: '',
  //       userStats: newUserInfo
  //     })
  //   } catch (err) { console.log('Error CREATING the game', err) }
  // }

  // async joinGame() {
  //   try {
  //     // create player instance on the current game
  //     const { userId, gameId, userStats } = this.state
  //     await axios.put(`${process.env.HOST}/api/games/${gameId}/${userId}`, { ...userStats })
  //     // add current game's id to user's game history
  //     await axios.put(`${process.env.HOST}/api/users/${userId}/${gameId}`)
  //     // get current game
  //     const res = await axios.get(`${process.env.HOST}/api/games/${gameId}`)
  //     let { start, target } = res.data
  //     // get start html
  //     start = underTitleize(start)
  //     const wikiRes = await axios.get(`${process.env.HOST}/api/wiki/${start}`)
  //     const html = wikiRes.data
  //     const { history } = this.state.userStats
  //     this.setState({
  //       start,
  //       target,
  //       html,
  //       userStats: {
  //         ...userStats,
  //         history: [...history, start]
  //       }
  //     })
  //   } catch (error) { console.log('Error JOINING the game', error) }
  // }

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
    const { clicks, history } = this.state.userStats
    // check if player won
    let { won } = this.state.userStats
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

  secondsToTime(secs) {
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    if (seconds >= 0 && seconds < 10) {
      const newSeconds = `0${seconds}`
      seconds = newSeconds
    }

    let obj = {
      "h": hours,
      "m": minutes,
      "s": seconds
    };
    return obj;
  }

  startTimer() {
    if (this.timer === 0 && this.state.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });

    // Check if we're at zero.
    if (seconds === 0) {
      clearInterval(this.timer);
    }
  }


  render() {
    const { start, target, html, userStats, gameId, startTime, endTime, initTime, pregame, finished } = this.state
    // pregame view
    if (pregame === true) {
      return (
        <div id="container">
          <div id="game-container" style={{ padding: 25 }}>
            <header className="game-header" style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
              <h1 className="game-title" >WikiLinks Game</h1>
              <GlobalGameInfo />
              <Login />

            </header>
            <div className='button-container' style={{ display: "flex", justifyContent: "center" }}>
              <button onClick={this.generateGlobalGame}>Generate Global Game</button>
              <button onClick={this.joinGlobalGame}>Join Global Game</button>
              <button onClick={this.stopGlobalGame}>Stop/Achive Global Game</button>
            </div>
            {/* separated divs so we can add pictures, etc */}
            <div className='pregame-container'>
              <div className='gameTimer-container' style={{ display: "flex", justifyContent: "center" }}>
                <h1>Global Game Start in {this.state.time.m}:{this.state.time.s}</h1>
              </div>
              <div className='pregame-container-time-remaining' style={{ display: "flex", justifyContent: "center" }}>
                <h2>Start: {this.state.start}</h2>
              </div>
              <div className='pregame-container-time-remaining' style={{ display: "flex", justifyContent: "center" }}>
                <h2>Target: {this.state.target}</h2>
              </div>
            </div>
          </div>
        </div>
      )
    } else if (finished === true) {
      console.log('FINISHED IS TRUE AND RENDER')
      return (
        <div id="container">
          <div id="game-container" style={{ padding: 25 }}>
            <header className="game-header" style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
              <h1 className="game-title" >WikiLinks Game</h1>
              <GlobalGameInfo />
              <Login />

            </header>
            <div className='button-container' style={{ display: "flex", justifyContent: "center" }}>
              <button onClick={this.generateGlobalGame}>Generate Global Game</button>
              <button onClick={this.joinGlobalGame}>Join Global Game</button>
              <button onClick={this.stopGlobalGame}>Stop/Achive Global Game</button>
            </div>
            <div className='gameover-container' style={{ display: "flex", flexDirection: "column", alignItems: 'center' }}>
              <h2>Game Finished!</h2>
              <p>Start: {this.state.start}</p>
              <p>Target: {this.state.target}</p>
              <p>History: {this.state.userStats.history.join(' => ')}</p>
              <p>Clicks: {this.state.userStats.clicks} </p>
            </div>
          </div>
        </div>
      )
    }

    else {

      return (
        <div id='container'>
          <div id="game-container" style={{ padding: 25 }}>
            <header className="game-header" style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
              <h1 className="game-title" >WikiLinks Game</h1>
              <GlobalGameInfo />
              <Login />

            </header>
            <div className='button-container' style={{ display: "flex", justifyContent: "center" }}>
              <button onClick={this.generateGlobalGame}>Generate Global Game</button>
              <button onClick={this.joinGlobalGame}>Join Global Game</button>
              <button onClick={this.stopGlobalGame}>Stop/Achive Global Game</button>
            </div>
            <div className='gameTimer-container' style={{ display: "flex", justifyContent: "center" }}>
              <h1>Global Game Ends in {this.state.time.m}:{this.state.time.s}</h1>
            </div>
            {/* <div>
            <button onClick={this.generateGame}>Generate Game</button>
            <button onClick={this.joinGame}>Join Game</button>
          </div> */}
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
              <LeaderboardContainer gameId={gameId} userStats={userStats} start={start} target={target} startTime={startTime} endTime={endTime} initTime={initTime} />
            </div>
          </div>
        </div >
      )
    }
  }
}
