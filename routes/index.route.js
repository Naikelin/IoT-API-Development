const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const adminController = require('../controllers/admin.controller')
const companyController = require('../controllers/company.controller')
const locationController = require('../controllers/location.controller')
const sensorController = require('../controllers/sensor.controller')

/* ADMIN ENDPOINTS */
/**
 * @swagger
 * /api/v1/admin:
 *  post:
 *      description: Create a new admin
 */
router.post('/create_admin', adminController.CreateAdmin)

/* COMPANY ENDPOINTS */
router.post('/create_company', auth.isAuth, companyController.CreateCompany)
router.get('/get_companies', auth.isAuth, companyController.GetCompanies)
//router.delete('/delete_company', companyController.DeleteCompany)

/* LOCATION ENDPOINTS */
router.post('/create_location', auth.checkApiKey, locationController.CreateLocation)
router.get('/get_locations', auth.checkApiKey, locationController.GetAllLocation)
router.get('/get_location_name', auth.checkApiKey, locationController.GetLocationByName)

/* SENSOR ENDPOINTS */
router.post('/create_sensor', auth.checkApiKey, sensorController.CreateSensor)
router.get('/get_sensors', auth.checkApiKey, sensorController.GetAllSensor)
router.get('/get_sensor_name', auth.checkApiKey, sensorController.GetSensorByName)
router.post('/sensor_data', auth.checkSensorApiKey, sensorController.insertSensorState)
router.get('/sensor_data', auth.checkApiKey, sensorController.getSensorData)

module.exports = router
