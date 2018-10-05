const router = require('express').Router()
const { getDate, getRandomNums, underTitleize, titleize } = require('./utils')
const { db } = require('../db/config')
const axios = require('axios')
module.exports = router

router.post('/', async (req, res, next) => {
  try {
    //check to see if a Global Game is already running
    const gameCheck = await db.ref('GlobalGame').once('value')
    if (gameCheck.val() !== null) {
      res.send({ error: 'Global Game Already Running!' })
    }
    else {
      // Get top articles of the day from WikiPedia
      const date = getDate()
      const topArticles = await axios.get(`https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia.org/all-access/${date[0]}/${date[1]}/${date[2]}`)
      const articles = topArticles.data.items[0].articles
      // Assign random top article to start and target articles of the game
      const randomNums = getRandomNums()
      const start = titleize(articles[randomNums[0]].article)
      const target = titleize(articles[randomNums[1]].article)
      //Assign start/end time
      const timeNow = new Date()
      const startTime = timeNow.toString()
      const endTime = new Date(timeNow.getTime() + 2 * 60000).toString()
      //Create a new game instance in Firebase
      const newGameId = await db.ref('GlobalGame').push().key
      await db.ref('GlobalGame/' + newGameId).set({
        gameId: newGameId,
        start: start,
        target: target,
        isRunning: false,
        startTime: startTime,
        endTime: endTime
      })
      res.send({ newGameId, start, target, startTime, endTime })
    }
  } catch (err) {
    next(err)
  }
})

router.put('/stopGlobalGame', async (req, res, next) => {
  try {
    await db.ref('GlobalGame').once('value', async snapshot => {
      snapshot.forEach(async currentGame => {
        const gameId = currentGame.key
        const gameData = currentGame.val()
        await db.ref('GlobalGameArchive/' + gameId).set({
          gameData
        })
      })
    })
    await db.ref('GlobalGame').remove()
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
})

router.get('/', async (req, res, next) => {
  try {
    await db.ref('GlobalGame').once('value', snapshot => {
      if (snapshot.val() === null) {
        res.send({ error: 'No game running!' })
      }
      snapshot.forEach(currentGame => {
        const gameId = currentGame.key
        const gameRef = db.ref(`GlobalGame/${gameId}`)
        gameRef.once('value', async (snapshot) => {
          const data = snapshot.val()
          const title = underTitleize(data.start)
          const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/html/${title}`)
          res.send({ start: data.start, target: data.target, html: response.data, gameId: data.gameId })
        })
      })
    })
  } catch (error) {
    next(error)
  }
})

// creates a new player in the current game with player game info and adds the game to user's history, called from join a game
router.put('/:gameId/:userId', async (req, res, next) => {
  try {
    const { gameId, userId } = req.params
    const { clicks, won } = req.body
    await db.ref(`GlobalGame/${gameId}/clickInfo/${userId}`).update({
      clicks,
      won
    })
    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
})

// fetches current game start and target, called by join game
router.get('/:gameId', async (req, res, next) => {
  try {
    const gameId = req.params.gameId
    const gameRef = await db.ref(`GlobalGame/${gameId}`)
    gameRef.once('value', async (snapshot) => {
      const data = await snapshot.val()
      res.send({
        start: data.start,
        target: data.target,
        clickInfo: data.clickInfo,
        startTime: data.startTime,
        endTime: data.endTime
      })
    })
  } catch (err) {
    next(err)
  }
})
