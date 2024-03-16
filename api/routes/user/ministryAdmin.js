const ministryAdminRouter = require('express').Router()
const ministryAdminController = require('../../controllers/user/ministryAdmin.js')

ministryAdminRouter.get('/', ministryAdminController.getList)
ministryAdminRouter.get('/:ministryAdminId', ministryAdminController.getById)
ministryAdminRouter.post('/', ministryAdminController.create)
ministryAdminRouter.put('/:ministryAdminId', ministryAdminController.update)
ministryAdminRouter.delete('/:ministryAdminId', ministryAdminController.remove)

module.exports = ministryAdminRouter
