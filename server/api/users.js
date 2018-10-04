const router = require('express').Router()
const { db } = require('../db/config')
const axios = require('axios')
module.exports = router

// creates a new player in the current game with player game info and adds the game to user's history, called from join a game
router.put('/:userId/:gameId', async (req, res, next) => {
  try {
    const { gameId, userId } = req.params
    const newGame = {}
    newGame[gameId] = true
    await db.ref(`Users/${userId}/gameHistory`).update({
      ...newGame
    })
    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
})
