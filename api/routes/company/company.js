const companyRouter = require('express').Router()
const auth = require('../../middleware/auth.js')

const companyController = require('../../controllers/company/company.js')

companyRouter.get('/', auth, companyController.getList)
companyRouter.get('/:companyId', companyController.getById)
companyRouter.post('/', companyController.create)
companyRouter.put('/:companyId', companyController.update)
companyRouter.delete('/:companyId', companyController.remove)

module.exports = companyRouter
