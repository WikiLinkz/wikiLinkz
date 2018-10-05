const router = require('express').Router()
const { db } = require('../db/config')
module.exports = router

//finds a game where isRunning is true and returns it, called by component did mount
router.get('/', async (req, res, next) => {
  try {
    const ref = await db.ref('Games')
    await ref.orderByChild('isRunning').equalTo(true).once('value', (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const gameId = Object.keys(data)[0]
        const game = data[gameId]
        res.send({ gameId, start: game.start, target: game.target })
      } else {
        res.sendStatus(200).end()
      }
    })
  } catch (err) {
    next(err)
  }
})

//creates a new game instance in db, called by generate game
router.post('/', async (req, res, next) => {
  try {
    const { start, target } = req.body
    const newGameId = await db.ref('Games/').push().key
    await db.ref('Games/' + newGameId).set({
      gameId: newGameId,
      start: start,
      target: target,
      isRunning: true,
      players: true,
      clickInfo: true
    })
    res.send({ newGameId })
  } catch (err) {
    next(err)
  }
})

// kills the current game, called by generate game
router.put('/', async (req, res, next) => {
  try {
    const gameId = req.body.gameId
    await db.ref(`Games/${gameId}`).update({ isRunning: false })
    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
})

// fetches current game start and target, called by join game
router.get('/:gameId', async (req, res, next) => {
  try {
    const gameId = req.params.gameId
    const gameRef = await db.ref(`Games/${gameId}`)
    gameRef.on('value', async (snapshot) => {
      const data = await snapshot.val()
      res.send({ start: data.start, target: data.target, clickInfo: data.clickInfo })
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
    await db.ref(`Games/${gameId}/clickInfo/${userId}`).update({
      clicks,
      won
    })
    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
})
