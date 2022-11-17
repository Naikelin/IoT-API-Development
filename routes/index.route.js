const express = require('express')
const router = express.Router()
const controller = require('../controllers/index.controller')
const adminController = require('../controllers/admin.controller')

router.post('/createAdmin', controller.CreateAdmin)
router.post('/admin/create_company', adminController.createCompany)
router.post('/admin/create_location', adminController.createLocation)
router.post('/admin/create_sensor', adminController.createSensor)

module.exports = router
