const router = require('express').Router()
const healthControler= require('../controllers/healthController')

router
.route('/health')
.get((req, res) => healthControler.check(req, res))

module.exports = router;