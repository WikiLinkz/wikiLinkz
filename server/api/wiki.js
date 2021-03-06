const router = require('express').Router()
const { getDate, getRandomNums, titleize, underTitleize } = require('./utils')
const axios = require('axios')
module.exports = router

// generates random start and target articles
router.get('/', async (req, res, next) => {
  try {
    // Get top articles of the day from WikiPedia
    const date = getDate()
    const topArticles = await axios.get(`https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia.org/all-access/${date[0]}/${date[1]}/${date[2]}`)
    const articles = topArticles.data.items[0].articles
    // Assign random top article to start and target articles of the game
    const randomNums = getRandomNums()
    const start = titleize(articles[randomNums[0]].article)
    const target = titleize(articles[randomNums[1]].article)
    res.send({ start, target })
  } catch (err) {
    next(err)
  }
})

// fetch wikipedia article by title
router.get('/:title', async (req, res, next) => {
  try {
    const title = underTitleize(req.params.title)
    // we can't do .replace(/,/g, '') here because some titles have commas!
    // => perhaps store in our db without commas?
    // encodeURI will make sure accents are encoded correctly
    const response = await axios.get
      (`https://en.wikipedia.org/api/rest_v1/page/html/${encodeURI(title)}`)
    res.send(response.data)
  } catch (err) {
    // if above errors, find the correct path using wiki error response
    const fixedTitle = err.response.request._options.path
    try {
      const fixedResponse = await axios.get
        (`https://en.wikipedia.org/api/rest_v1/page/html${fixedTitle}`)
      res.send(fixedResponse.data)
    } catch (err) {
      next(err)
    }
  }
})
