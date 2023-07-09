const router = require('express').Router()

// Health check router
const healthRouter = require('./health')
router.use('/', healthRouter)

module.exports = router