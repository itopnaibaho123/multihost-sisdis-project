const shipmentRouter = require('express').Router()
const shipmentController = require('../../controllers/company/shipment.js')

shipmentRouter.get('/', shipmentController.getShipments)
shipmentRouter.get('/:shipmentId', shipmentController.getShipmentById)
shipmentRouter.post('/', shipmentController.createShipment)
shipmentRouter.put('/:shipmentId', shipmentController.updateShipment)
shipmentRouter.delete('/:shipmentId', shipmentController.deleteShipment)

module.exports = shipmentRouter;