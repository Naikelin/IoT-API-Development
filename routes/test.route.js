const express = require('express')
const router = express.Router()
const controller = require('../controllers/test.controller')
const auth = require('../middlewares/auth')

router.get('/', auth.isAuth, controller.Test)

module.exports = router

