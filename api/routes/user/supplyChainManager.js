const scManagerRouter = require('express').Router()
const scStaffController = require('../../controllers/user/supplyChainManager.js')

scManagerRouter.get('/', scStaffController.getList)
scManagerRouter.get('/:scManagerId', scStaffController.getById)
scManagerRouter.post('/', scStaffController.create)
scManagerRouter.put('/:scManagerId', scStaffController.update)
scManagerRouter.delete('/:scManagerId', scStaffController.remove)

module.exports = scManagerRouter;