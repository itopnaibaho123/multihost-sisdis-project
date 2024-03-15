const divisionRouter = require('express').Router()
const divisionController = require('../../controllers/company/division.js')

divisionRouter.get('/', divisionController.getDivisions)
divisionRouter.get('/:divisionId', divisionController.getDivisionById)
divisionRouter.post('/', divisionController.createDivision)
divisionRouter.put('/:divisionId', divisionController.updateDivision)
divisionRouter.delete('/:divisionId', divisionController.deleteDivision)

module.exports = divisionRouter;