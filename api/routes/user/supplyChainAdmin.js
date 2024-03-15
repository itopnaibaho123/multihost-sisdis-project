const scAdminRouter = require('express').Router()
const scStaffController = require('../../controllers/user/supplyChainManager.js')

scAdminRouter.get('/', scStaffController.getList)
scAdminRouter.get('/:scAdminId', scStaffController.getById)
scAdminRouter.post('/', scStaffController.create)
scAdminRouter.put('/:scAdminId', scStaffController.update)
scAdminRouter.delete('/:scAdminId', scStaffController.remove)

module.exports = scAdminRouter;