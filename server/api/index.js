const router = require('express').Router()
module.exports = router

router.use('/users', require('./users'))
router.use('/games', require('./games'))
router.use('/wiki', require('./wiki'))
router.use('/globalGame', require('./globalGame'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
