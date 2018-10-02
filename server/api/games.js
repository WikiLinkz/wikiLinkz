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
    res.send(newGameId)
  } catch (err) {
    next(err)
  }
})

// router.get('./:gameId', (req, res, next) => {
//   const gameId = req.params.gameId
//   const gameRef = db.ref(`Games/${gameId}`)
//   gameRef.on('value', async (snapshot) => {
//     const data = snapshot.val()
//     const title = underTitleize(data.start)
//     const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/html/${title}`)
//     res.send({ start: data.start, target: data.target, html: response.data })
//   })
// })


