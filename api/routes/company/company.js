const companyRouter = require('express').Router()
const companyController = require('../../controllers/company/company.js')

companyRouter.get('/', companyController.getList)
companyRouter.get('/:companyId', companyController.getById)
companyRouter.post('/', companyController.create)
companyRouter.put('/:companyId', companyController.update)
companyRouter.delete('/:companyId', companyController.remove)

module.exports = companyRouter;