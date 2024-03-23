const vehicleRouter = require('express').Router()
const vehicleController = require('../controllers/company/vehicle.js')

vehicleRouter.get('/vehicle', vehicleController.getList)
vehicleRouter.get('/vehicle/:vehicleId', vehicleController.getById)
vehicleRouter.post('/vehicle', vehicleController.create)
vehicleRouter.put('/vehicle/:vehicleId', vehicleController.update)
vehicleRouter.delete('/vehicle/:vehicleId', vehicleController.remove)

module.exports = vehicleRouter
