const router = require('express').Router()
const { db } = require('../db/config')
module.exports = router

// creates a new player in the current game with player game info and adds the game to user's history, called from join a game
router.put('/:userId/:gameId', async (req, res, next) => {
  try {
    const { gameId, userId } = req.params
    await db.ref(`Users/${userId}/gameHistory`).update({
      [gameId]: req.body
    })
    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
})

// finds a user's game history
router.get('/:userId/games', async (req, res, next) => {
  try {
    const { userId } = req.params
    await db.ref(`Users/${userId}/gameHistory`).once('value', async (snapshot) => {
      const games = snapshot.val()
      res.send(games)
    })
  } catch (err) {
    next(err)
  }
})