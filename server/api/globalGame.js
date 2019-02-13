const router = require('express').Router()
const { db } = require('../db/config')
const { getPoints } = require('./utils')
module.exports = router

// time IN SECONDS BEFORE THE 1000
const preGameLength = 15 * 1000
const gameLength = 120 * 1000
const gameFinishedBuffer = 5 * 1000

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
    const { start, target, startSummary, targetSummary, startImg, targetImg } = req.body
    const gameId = await db.ref('GlobalGame').push().key
    await db.ref('GlobalGame/').set({
      gameId: gameId,
      start: start,
      startSummary: startSummary,
      targetSummary: targetSummary,
      startImg: startImg,
      targetImg: targetImg,
      target: target,
      clickInfo: true,
      startTime: startTime,
      endTime: endTime,
      initTime: initTime,
      pregame: true,
    })
    res.send({ gameId, startTime, endTime, initTime })

    // setTimeouts for different game states (pregame, finished)
    // after preGameLength (s) set pregame to false
    setTimeout(async () => {
      await db.ref('GlobalGame').update({
        pregame: false,
      })
    }, preGameLength)

    // after preGameLength + gameLength (s) set finished to true and save a copy
    // in GlobalGameArchive/gameId/
    setTimeout(async () => {
      await db.ref('GlobalGame').update({
        finished: true,
      })
      await db.ref('GlobalGame').once('value', async snapshot => {
        const currentGame = snapshot.val()
        const gameId = currentGame.gameId
        const start = currentGame.start
        const target = currentGame.target
        await db.ref('GlobalGame/clickInfo').once('value', async snapshot => {
          users = snapshot.val()
          for (user in users) {
            const clickData = users[user]
            await db.ref(`Users/${user}/gameHistory/${gameId}`).set({
              ...clickData,
              start,
              target,
            })
          }
        })
        await db.ref('GlobalGameArchive/' + gameId).set({
          ...currentGame,
        })
      })
    }, gameLength + preGameLength)

    // preGameLength + gameLength + gameFinishedBuffer delete the game from
    // GlobalGame/
    setTimeout(async () => {
      await db.ref('GlobalGame').remove()
      // add gameFinishedBuffer after game end before deleting
    }, gameLength + preGameLength + gameFinishedBuffer)
  } catch (err) {
    next(err)
  }
})

// creates a new player in the current game with player game info and adds the game to user's history, called from join a game
router.put('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params
    const { clicks, won, username, history } = req.body

    // get points
    let points = getPoints(clicks)

    const historyStr = history.join(',')
    // put username here!
    await db.ref(`GlobalGame/clickInfo/${userId}`).update({
      clicks,
      won,
      username,
      points,
      history: historyStr,
    })
    res.sendStatus(201)
  } catch (err) {
    next(err)
  }
})
