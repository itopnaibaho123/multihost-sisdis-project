const carbonEmissionRouter = require('express').Router()
const carbonEmissionController = require('../../controllers/company/carbonEmission.js')

carbonEmissionRouter.get('/', carbonEmissionController.getCarbonEmissions)
carbonEmissionRouter.get('/:carbonEmissionId', carbonEmissionController.getCarbonEmissionById)
carbonEmissionRouter.post('/', carbonEmissionController.createCarbonEmission)
carbonEmissionRouter.put('/:carbonEmissionId', carbonEmissionController.updateCarbonEmission)
carbonEmissionRouter.delete('/:carbonEmissionId', carbonEmissionController.deleteCarbonEmission)

module.exports = carbonEmissionRouter;