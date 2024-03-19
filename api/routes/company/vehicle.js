const vehicleRouter = require('express').Router()
const vehicleController = require('../../controllers/company/vehicle.js')

vehicleRouter.get('/', vehicleController.getList)
vehicleRouter.get('/:vehicleId', vehicleController.getById)
vehicleRouter.post('/', vehicleController.create)
vehicleRouter.put('/:vehicleId', vehicleController.update)
vehicleRouter.delete('/:vehicleId', vehicleController.remove)

module.exports = vehicleRouter
