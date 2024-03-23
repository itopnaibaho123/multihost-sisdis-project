const carbonEmissionRouter = require('express').Router()
const carbonEmissionController = require('../../../controllers/company/carbonEmission.js')

carbonEmissionRouter.get('/', carbonEmissionController.getList)
carbonEmissionRouter.get('/:carbonEmissionId', carbonEmissionController.getById)
carbonEmissionRouter.post('/', carbonEmissionController.create)
carbonEmissionRouter.put('/:carbonEmissionId', carbonEmissionController.update)
carbonEmissionRouter.delete(
  '/:carbonEmissionId',
  carbonEmissionController.remove
)

module.exports = carbonEmissionRouter
