const router = require('express').Router()
const { db } = require('../db/config')
const axios = require('axios')
module.exports = router

// fetch wikipedia article by title
router.get('/:title', async (req, res, next) => {
  const title = req.params.title
  try {
    const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/html/${title}`)
    res.send(response.data)
  } catch (err) {
    next(err)
  }
})
