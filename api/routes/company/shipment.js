const shipmentRouter = require('express').Router()
const shipmentController = require('../../controllers/company/shipment.js')

shipmentRouter.get('/', shipmentController.getList)
shipmentRouter.get('/:shipmentId', shipmentController.getById)
shipmentRouter.post('/', shipmentController.create)
shipmentRouter.put('/:shipmentId', shipmentController.update)
shipmentRouter.delete('/:shipmentId', shipmentController.remove)

module.exports = shipmentRouter;