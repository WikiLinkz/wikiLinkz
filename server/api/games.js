const router = require('express').Router()
const { getDate, getRandomNums, underTitleize, titleize } = require('./utils')
const { db } = require('../db/config')
const axios = require('axios')
module.exports = router

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

router.post('/', async (req, res, next) => {
  try {
    // Get top articles of the day from WikiPedia
    const date = getDate()
    const topArticles = await axios.get(`https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia.org/all-access/${date[0]}/${date[1]}/${date[2]}`)
    const articles = topArticles.data.items[0].articles
    // Assign random top article to start and target articles of the game
    const randomNums = getRandomNums()
    const start = titleize(articles[randomNums[0]].article)
    const target = titleize(articles[randomNums[1]].article)
    //Create a new game instance in Firebase
    const newGameId = await db.ref('Games/').push().key
    await db.ref('Games/' + newGameId).set({
      gameId: newGameId,
      start: start,
      target: target,
      isRunning: true,
      players: true,
      clickInfo: true
    })
    res.send({ newGameId, start, target })
  } catch (err) {
    next(err)
  }
})

router.put('/', async (req, res, next) => {
  try {
    const gameId = req.body.gameId
    await db.ref(`Games/${gameId}`).update({ isRunning: false })
    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
})

router.get('/:gameId', (req, res, next) => {
  const gameId = req.params.gameId
  const gameRef = db.ref(`Games/${gameId}`)
  gameRef.on('value', async (snapshot) => {
    const data = snapshot.val()
    const title = underTitleize(data.start)
    const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/html/${title}`)
    res.send({ start: data.start, target: data.target, html: response.data })
  })
})

// router.put('/:gameId/:userId', async (req, res, next) => {
//   const { gameId, userId } = req.params
//   await db.ref(`Games/${gameId}/clickInfo/${userId}`).set({

//   })

// })

