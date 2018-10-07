const router = require('express').Router()
const { getDate, getRandomNums, underTitleize, titleize } = require('./utils')
const { db } = require('../db/config')
const axios = require('axios')
module.exports = router

// finds Global Game, returns start, target, gameId, called from componentDidMount
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
          const { gameId, start, target, startTime, endTime } = data
          res.send({ gameId, start, target, startTime, endTime })
        })
      })
    })
  } catch (error) {
    next(error)
  }
})

//creates a new game instance in db, called by generate game
router.post('/', async (req, res, next) => {
  try {
    //Assign start/end time
    const timeNow = new Date()
    const startTime = timeNow.toString()
    const endTime = new Date(timeNow.getTime() + 2 * 60000).toString()
    //Create a new game instance in Firebase
    const { start, target } = req.body
    const gameId = await db.ref('GlobalGame').push().key
    await db.ref('GlobalGame/' + gameId).set({
      gameId: gameId,
      start: start,
      target: target,
      isRunning: false,
      clickInfo: true,
      startTime: startTime,
      endTime: endTime
    })
    res.send({ gameId, startTime, endTime })
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

// fetches current game start and target, called by join game
router.get('/:gameId', async (req, res, next) => {
  try {
    const gameId = req.params.gameId
    const gameRef = await db.ref(`GlobalGame/${gameId}`)
    gameRef.once('value', async (snapshot) => {
      const data = await snapshot.val()
      const { start, target, clickInfo, startTime, endTime } = data
      res.send({
        start,
        target,
        clickInfo,
        startTime,
        endTime
      })
    })
  } catch (err) {
    next(err)
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