const router = require('express').Router()
const { db } = require('../db/config')
const axios = require('axios')
module.exports = router

// time IN SECONDS
const preGameLength = 5 * 1000
const gameLength = 10 * 1000
const gameFinishedBuffer = .5 * 1000



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
          const { gameId, start, target, startTime, endTime, initTime } = data
          res.send({ gameId, start, target, startTime, endTime, initTime })
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
    const initTime = timeNow.toString()
    // decimal below is in minutes
    const startTime = new Date(timeNow.getTime() + preGameLength).toString()
    const endTime = new Date(timeNow.getTime() + (gameLength + preGameLength)).toString()
    //Create a new game instance in Firebase
    const { start, target } = req.body
    const gameId = await db.ref('GlobalGame').push().key
    await db.ref('GlobalGame/').set({
      gameId: gameId,
      start: start,
      target: target,
      clickInfo: true,
      startTime: startTime,
      endTime: endTime,
      initTime: initTime,
      pregame: true,
    })
    res.send({ gameId, startTime, endTime, initTime })
    // puts game in archive and delete it after
    setTimeout(async () => {
      await db.ref('GlobalGame').update({
        pregame: false
      })
    }, preGameLength)
    setTimeout(async () => {
      await db.ref('GlobalGame').update({
        finished: true
      })
      await db.ref('GlobalGame').once('value', async snapshot => {
        const currentGame = snapshot.val()
        const gameId = currentGame.gameId
        await db.ref('GlobalGameArchive/' + gameId).set({
          ...currentGame
        })
      })

    }, gameLength + preGameLength)
    setTimeout(async () => {
      await db.ref('GlobalGame').remove()
      // add gameFinishedBuffer after game end before deleting
    }, (gameLength + preGameLength + gameFinishedBuffer))
  } catch (err) {
    next(err)
  }
})

// no longer necessary
// router.put('/stopGlobalGame', async (req, res, next) => {
//   try {
//     await db.ref('GlobalGame').once('value', async snapshot => {
//       snapshot.forEach(async currentGame => {
//         const gameId = currentGame.key
//         const gameData = currentGame.val()
//         await db.ref('GlobalGameArchive/' + gameId).set({
//           gameData
//         })
//       })
//     })
//     await db.ref('GlobalGame').remove()
//     res.sendStatus(204)
//   } catch (error) {
//     next(error)
//   }
// })

// fetches current game start and target, called by join game
router.get('/:gameId', async (req, res, next) => {
  try {
    const gameId = req.params.gameId
    const gameRef = await db.ref(`GlobalGame`)
    gameRef.once('value', (snapshot) => {
      const data = snapshot.val()
      const { start, target, clickInfo, startTime, endTime, initTime } = data
      res.send({
        start,
        target,
        clickInfo,
        startTime,
        endTime,
        initTime
      })
    })
  } catch (err) {
    next(err)
  }
})

// creates a new player in the current game with player game info and adds the game to user's history, called from join a game
router.put('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params
    const { clicks, won } = req.body
    // put username here!
    await db.ref(`GlobalGame/clickInfo/${userId}`).update({
      clicks,
      won
    })
    res.sendStatus(201)
  } catch (err) {
    next(err)
  }
})
