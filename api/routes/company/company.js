const companyRouter = require('express').Router()
const companyController = require('../../controllers/company/company.js')

companyRouter.get('/', companyController.getCompanies)
companyRouter.get('/:companyId', companyController.getCompanyById)
companyRouter.post('/', companyController.createCompany)
companyRouter.put('/:companyId', companyController.updateCompany)
companyRouter.delete('/:companyId', companyController.deleteCompany)

module.exports = companyRouter;