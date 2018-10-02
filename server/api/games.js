const router = require('express').Router()
const { getDate, getRandomNums, titleize } = require('./utils')
const { db } = require('../db/config')
const axios = require('axios')
module.exports = router

router.post('/', async (req, res, next) => {
  try {
    // Get top articles of the day from WikiPedia
    const date = getDate()
    const topArticles = await axios.get(`https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia.org/all-access/${date[0]}/${date[1]}/${date[2]}`)
    const articles = topArticles.data.items[0].articles
    // Assign random top article to start and target articles of the game
    const randomNums = getRandomNums()
    const start = articles[randomNums[0]].article
    const target = articles[randomNums[1]].article
    //Create a new game instance in Firebase
    const newGameId = await db.ref().child('Games').push().key
    await db.ref('Games/' + newGameId).set({
      gameId: newGameId,
      start: titleize(start),
      target: titleize(target),
      isRunning: false
    })
    res.send(db.ref('Games/' + newGameId))
  } catch (err) {
    next(err)
  }
})



