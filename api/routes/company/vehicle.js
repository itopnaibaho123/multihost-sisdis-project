const vehicleRouter = require('express').Router()
const vehicleController = require('../../controllers/company/vehicle.js')

vehicleRouter.get('/', vehicleController.getVehicles)
vehicleRouter.get('/:vehicleId', vehicleController.getVehicleById)
vehicleRouter.post('/', vehicleController.createVehicle)
vehicleRouter.put('/:vehicleId', vehicleController.updateVehicle)
vehicleRouter.delete('/:vehicleId', vehicleController.deleteVehicle)

module.exports = vehicleRouter;