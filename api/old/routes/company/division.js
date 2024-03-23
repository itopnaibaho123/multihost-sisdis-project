const divisionRouter = require('express').Router()
const divisionController = require('../../controllers/company/division.js')

divisionRouter.get('/', divisionController.getList)
divisionRouter.get('/:divisionId', divisionController.getById)
divisionRouter.post('/', divisionController.create)
divisionRouter.put('/:divisionId', divisionController.update)
divisionRouter.delete('/:divisionId', divisionController.remove)

module.exports = divisionRouter
