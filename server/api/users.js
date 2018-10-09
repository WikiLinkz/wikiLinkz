const router = require('express').Router()
const { db } = require('../db/config')
const axios = require('axios')
module.exports = router

// creates a new player in the current game with player game info and adds the game to user's history, called from join a game
router.put('/:userId/:gameId', async (req, res, next) => {
  try {
    const { gameId, userId } = req.params
    const newGame = {}
    newGame[gameId] = gameId
    await db.ref(`Users/${userId}/gameHistory`).update({
      ...newGame
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
      const gameIds = Object.keys(snapshot.val())
      res.send(gameIds)
    })
  } catch (err) {
    next(err)
  }
})